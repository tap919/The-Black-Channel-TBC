import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
// FIX 1: Read PORT from environment instead of hardcoding
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// FIX 2: Add CORS middleware
app.use(cors());

// Set up JSON parsing
app.use(express.json());

// FIX 3: Add rate limiting to all /api/ routes (100 req per 15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down and try again later." }
});
app.use("/api/", apiLimiter);

// More aggressive limit for AI-heavy routes (20 req per 15 min per IP)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI endpoint rate limit reached. Please wait before making more requests." }
});

// Lazy-loaded Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in your Secrets/Settings panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// FIX 4: Input sanitization helper — strips prompt injection attempts
function sanitizeInput(input: string): string {
  // Remove common prompt injection patterns
  return input
    .replace(/ignore (all |previous |above |prior )?instructions?/gi, "[filtered]")
    .replace(/system\s*prompt/gi, "[filtered]")
    .replace(/you are now/gi, "[filtered]")
    .replace(/forget (everything|all|previous)/gi, "[filtered]")
    .replace(/new (role|persona|instructions?)/gi, "[filtered]")
    .replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, "") // strip HTML tags
    .trim()
    .slice(0, 2000); // hard cap at 2000 chars
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Transmutation Lab API
app.post("/api/transmute", aiLimiter, async (req, res) => {
  try {
    const { element1, element2, rawContent } = req.body;

    if (!rawContent || rawContent.trim() === "") {
      return res.status(400).json({ error: "Choose elements and feed the crucible some raw content to begin!" });
    }

    // FIX 4: Sanitize user input before inserting into prompt
    const safeRawContent = sanitizeInput(rawContent);

    const client = getGeminiClient();

    const elementMap: Record<string, string> = {
      Hm: "Music (Hm - Album reviews, lyrics, beats, artist vision)",
      Hc: "Culture (Hc - Street trends, fashion, lifestyle, history)",
      Hs: "Sports (Hs - Game debates, athletic hustle, street vs suite)",
      Hb: "Business (Hb - Side hustles, marketing, brand strategy, financial literacy)",
      Hg: "Guests (Hg - Live interaction, street feedback, community voices)"
    };

    const firstElement = elementMap[element1] || "Culture (Hc)";
    const secondElement = element2 ? elementMap[element2] : "None";

    const prompt = `Perform an alchemical transmutation on the following raw base ingredients:
- Primary Element: ${firstElement}
- Secondary Catalyst: ${secondElement}
- Raw base material: "${safeRawContent}"

Refine this raw material into an intellectual, creative, and highly polished cultural narrative or business recipe. Expose how to transform the struggle or raw energy into peak commercial or cultural success (Pure Gold). Output the response strictly conforming to the specified JSON schema.`;

    const response = await client.models.generateContent({
      // FIX 5: Correct model name (was "gemini-3.5-flash" which doesn't exist)
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are the Hood Alchemist—the ultimate voice of the culture. " +
          "Your mission is to perform alchemical transmutations: taking raw street hustle, lines, sports debates, or track names, " +
          "and refining them into intellectual gold. You combine gritty street wisdom with Harvard-level brand marketing and hip-hop critique. " +
          "Use elemental symbols like Hm, Hc, Hs, Hb, Hg where appropriate. " +
          "Provide ratings on a periodic table scale (1 to 118, where 1-39 is raw/rough, 40-79 is solid/refined chemistry, and 80-118 is pure alchemical classic status).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transmutedTitle: {
              type: Type.STRING,
              description: "A brilliant, high-energy cultural or episode-like title for this transmutation"
            },
            purityScore: {
              type: Type.NUMBER,
              description: "The calculated alchemical purity of this refined compound (out of 100)"
            },
            elementFormula: {
              type: Type.STRING,
              description: "Chemical symbol expression matching the active elements (e.g. 'Hm2Hb' or 'Hc+Hs')"
            },
            ratings: {
              type: Type.OBJECT,
              properties: {
                Lr: { type: Type.NUMBER, description: "Lyricism / Idea rating (1 to 118 periodic index)" },
                Pr: { type: Type.NUMBER, description: "Production / Branding rating (1 to 118 periodic index)" },
                Cw: { type: Type.NUMBER, description: "Cultural Weight rating (1 to 118 periodic index)" },
                Rv: { type: Type.NUMBER, description: "Replay Value / Commercial Scalability rating (1 to 118 periodic index)" },
                Ch: { type: Type.NUMBER, description: "Cohesion rating (1 to 118 periodic index)" }
              },
              required: ["Lr", "Pr", "Cw", "Rv", "Ch"]
            },
            analysisBreakdown: {
              type: Type.OBJECT,
              properties: {
                rawCompoundIntro: { type: Type.STRING, description: "An investigation of the raw input elements (The Crucible study, 2-3 sentences)" },
                reactionChamberProcess: { type: Type.STRING, description: "How the elements reacted and combined, stripping away the impurities (The Alchemical Reaction, 3-4 sentences)" },
                goldStandardResult: { type: Type.STRING, description: "The final polished cultural/business playbook, elevated advice, or review critique (The pure gold product, 4-5 sentences)" },
                barsOrQuotes: { type: Type.STRING, description: "An elevated original rap bar, quote, or slogan that sums up the core truth of this transmutation" }
              },
              required: ["rawCompoundIntro", "reactionChamberProcess", "goldStandardResult", "barsOrQuotes"]
            }
          },
          required: ["transmutedTitle", "purityScore", "elementFormula", "ratings", "analysisBreakdown"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Transmutation API error:", error);
    return res.status(500).json({ error: error.message || "Crucible heat limit breached. Failed to transmute." });
  }
});

// Seeded In-Memory Databases for Persistent Live Interaction
const networkProfiles = [
  {
    id: "leg-1",
    name: "DJ Haze",
    skills: "MPC Production, Vintage Vinyl Sampling, Audio Engineering",
    location: "Crenshaw, LA",
    goals: "Seeking a lyrical rapper to drop classic street verses on high-swing soulful loops",
    reputation: 98,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "leg-2",
    name: "Sasha 'Queen Hustle' D.",
    skills: "Brand Marketing, Social Campaign Design, Apparel Sourcing",
    location: "Flatbush, Brooklyn",
    goals: "Seeking and mentoring starting streetwear designers ready to print heavy custom cotton",
    reputation: 114,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "leg-3",
    name: "Marcus Henderson",
    skills: "Gourmet Southern Sautéing, Logistics Management, Catering Scale",
    location: "Atlanta, GA",
    goals: "Seeking an investor or designer partner to co-construct an alchemical fusion food truck",
    reputation: 89,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "leg-4",
    name: "Dr. Alchemist-in-Chief",
    skills: "Audio Broadcast Host, Cultural Theory Analysis, Licensing Law",
    location: "Mid-City, LA",
    goals: "Seeking local entrepreneurs and musical artists to highlight weekly on Hood Alchemy main podcast",
    reputation: 118,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

const radioRotation = [
  {
    id: "track-1",
    title: "Slauson Renaissance",
    artist: "King Kendrick Jr.",
    genre: "Soulful Boom-Bap",
    link: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav",
    reputation: 112,
    upvotes: 142,
    review: "This track carries the true spiritual weight of the streets. The choice of the dusty trumpet sample in the chorus is pure alchemy. Exceptional flow control.",
    barsOfGold: "'I watched the block transmute into diamonds, we survived the pressure while the carbon was climbing.'"
  },
  {
    id: "track-2",
    title: "Sliding Ratios",
    artist: "Trap Chemist",
    genre: "High-Reactive Drill",
    link: "https://assets.mixkit.co/active_storage/sfx/1012/1012-84.wav",
    reputation: 94,
    upvotes: 89,
    review: "The sliding 808 sub glides offer maximum structural kinetic force. Heavy street level momentum but could use a cleaner mixing ratio on high-hat resonances.",
    barsOfGold: "'MPC in the basement, mercury in the beaker, chemical equation shaking out of the speaker.'"
  }
];

// Fallback high-quality curated images for Hip-Hop / Street design aesthetics
const galleryCovers: Record<string, string[]> = {
  mixtape: [
    "https://images.unsplash.com/photo-1518655061768-98de35ca7f6b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  ],
  flyer: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80"
  ],
  logo: [
    "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?w=800&auto=format&fit=crop&q=80"
  ],
  podcast: [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80"
  ]
};

// ==========================================================
// 1. THE PRESS: AI Album Cover / Flyer Designer API
// ==========================================================
app.post("/api/press/generate", aiLimiter, async (req, res) => {
  try {
    const { template, prompt, aspect } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Choose a visual target elements description first." });
    }

    // FIX 4: Sanitize prompt
    const safePrompt = sanitizeInput(prompt);
    const aspectValue = aspect || "1:1";
    const enhancedPrompt = `A high-quality gritty, gold, distressed, street-style hip-hop theme ${template} graphic: ${safePrompt}. Cinematic lighting, rich street elements, gold foil textures, weathered look, authentic urban culture aesthetic. No device frames.`;

    try {
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        // FIX 5: Correct image generation model (was "gemini-2.5-flash-image" which doesn't exist)
        model: "imagen-3.0-generate-001",
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectValue
          }
        }
      });

      let base64Image = null;
      if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (base64Image) {
        return res.json({ imageUrl: base64Image, source: "Gemini AI" });
      } else {
        throw new Error("No inline image returned from model.");
      }
    } catch (apiErr: any) {
      console.warn("Gemini Image API not available, loading from premium catalog fallback:", apiErr.message);
      const gallery = galleryCovers[template] || galleryCovers.mixtape;
      let hash = 0;
      for (let i = 0; i < safePrompt.length; i++) {
        hash = safePrompt.charCodeAt(i) + ((hash << 5) - hash);
      }
      const selectIndex = Math.abs(hash) % gallery.length;
      const imageUrl = gallery[selectIndex];
      return res.json({
        imageUrl,
        source: "Refined Catalog Fallback",
        warning: "Running in offline/trial mode; generated a beautifully curated hip-hop template asset matching your input."
      });
    }
  } catch (error: any) {
    console.error("Press Generator API error:", error);
    return res.status(500).json({ error: error.message || "Failed to print graphic." });
  }
});

// ==========================================================
// 2. THE SPORTSBOOK: AI Prediction, Analysis & Bunsen Burner Bet
// ==========================================================
app.get("/api/sports/odds", async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      const oddsResponse = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=us&markets=h2h&oddsFormat=american&apiKey=${apiKey}`);
      if (oddsResponse.ok) {
        const data: any = await oddsResponse.json();
        const games = data.slice(0, 8).map((g: any) => {
          let homeOdds = "+100";
          let awayOdds = "-120";
          const h2h = g.bookmakers?.[0]?.markets?.find((m: any) => m.key === "h2h");
          if (h2h) {
            const hOutcome = h2h.outcomes?.find((o: any) => o.name === g.home_team);
            const aOutcome = h2h.outcomes?.find((o: any) => o.name === g.away_team);
            if (hOutcome) homeOdds = hOutcome.price > 0 ? `+${hOutcome.price}` : `${hOutcome.price}`;
            if (aOutcome) awayOdds = aOutcome.price > 0 ? `+${aOutcome.price}` : `${aOutcome.price}`;
          }
          return {
            id: g.id,
            sport: g.sport_title,
            homeTeam: g.home_team,
            awayTeam: g.away_team,
            homeOdds,
            awayOdds,
            commenceTime: g.commence_time,
            isLive: false,
            source: g.bookmakers?.[0]?.title || "Live Books Provider"
          };
        });
        return res.json({ success: true, games, source: "Live Sportsbook integration" });
      }
    }
  } catch (err) {
    console.warn("Odds API fetch failed, loading fallback lines:", err);
  }

  const simulatedGames = [
    {
      id: "sim-1",
      sport: "NBA Basketball",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      homeOdds: "-110",
      awayOdds: "+110",
      commenceTime: "Tonight 7:30 PM",
      isLive: true,
      source: "Real Odds Simulator"
    },
    {
      id: "sim-2",
      sport: "NBA Basketball",
      homeTeam: "Knicks",
      awayTeam: "Cavaliers",
      homeOdds: "-145",
      awayOdds: "+125",
      commenceTime: "Tonight 8:00 PM",
      isLive: false,
      source: "Real Odds Simulator"
    },
    {
      id: "sim-3",
      sport: "NFL Football",
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      homeOdds: "-130",
      awayOdds: "+110",
      commenceTime: "Tomorrow 4:15 PM",
      isLive: false,
      source: "Real Odds Simulator"
    },
    {
      id: "sim-4",
      sport: "NFL Football",
      homeTeam: "Lions",
      awayTeam: "49ers",
      homeOdds: "+110",
      awayOdds: "-130",
      commenceTime: "Tomorrow 8:20 PM",
      isLive: false,
      source: "Real Odds Simulator"
    }
  ];
  return res.json({ success: true, games: simulatedGames, source: "Live simulator (Configure ODDS_API_KEY for real sync)" });
});

app.post("/api/sports/predict", aiLimiter, async (req, res) => {
  try {
    const { lineupOrSlip } = req.body;
    if (!lineupOrSlip || lineupOrSlip.trim() === "") {
      return res.status(400).json({ error: "Pour a lineup or game slip into the analyzer beaker!" });
    }

    // FIX 4: Sanitize user input
    const safeLineup = sanitizeInput(lineupOrSlip);

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      // FIX 5: Correct model name
      model: "gemini-2.0-flash",
      contents: `Analyze this sports betting slip or fantasy sports lineup: "${safeLineup}". Break down the matchups, injuries, weather, historical performance, and social media/locker room vibes. Output the analysis strictly with the specified JSON schema. Use street-level grit combined with advanced analytics chemistry.`,
      config: {
        systemInstruction: "You are The Oracle, the ultimate AI Sports analyst of the Hood Sportsbook. You speak like a street-smart Vegas booking chemist.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.INTEGER, description: "Confidence score from 0 to 100 for this prediction/lineup" },
            riskAssessment: { type: Type.STRING, description: "E.g., Low Volatility Catalyst, Medium Reactive, High Combustion Risk, Extreme Boiling" },
            matchUpAnalysis: { type: Type.STRING, description: "Detailed 4-5 sentences analysis on team/player matchups and tactical elements" },
            injuryReport: { type: Type.STRING, description: "Active dynamic injury reactions in the crucible roster" },
            weatherImpact: { type: Type.STRING, description: "Outdoor elements influence on performance coefficients" },
            socialSentiment: { type: Type.STRING, description: "Locker room heat, player tweets and social media vibe synthesis" },
            pureGoldVerdict: { type: Type.STRING, description: "The final alchemical formula advice for locking in positive returns" }
          },
          required: ["confidenceScore", "riskAssessment", "matchUpAnalysis", "injuryReport", "weatherImpact", "socialSentiment", "pureGoldVerdict"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Sports Predict API error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate Sportsbook analysis." });
  }
});

app.post("/api/sports/burner-bet", aiLimiter, async (req, res) => {
  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      // FIX 5: Correct model name
      model: "gemini-2.0-flash",
      contents: "Generate today's 'The Bunsen Burner Bet' underdog pick. Choose any realistic high-value sports matchup (NBA, NFL, UFC, Champions League, etc.) where the underdog has a high probability of a chemical upset blowout. Conform strictly to JSON schema.",
      config: {
        systemInstruction: "You are The Oracle. Spot a massive undervalued underdog and explain the exact chemistry that creates this blowout explosion today.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gameTitle: { type: Type.STRING, description: "Matchup name, e.g., 'Celtics at Heat'" },
            underdogTeam: { type: Type.STRING, description: "The specific underdog selection" },
            payoutOdds: { type: Type.STRING, description: "E.g. '+240 Moneyline' or '+7.5 Spread'" },
            reactivityScore: { type: Type.INTEGER, description: "Reactivity rating (out of 118 alchemical elements index)" },
            alchemicalExplanation: { type: Type.STRING, description: "A detailed description explaining why the formulas line up for an upset" },
            riskRating: { type: Type.STRING, description: "E.g. 'High Glow', 'Highly Volatile', 'Stable Catalyst'" }
          },
          required: ["gameTitle", "underdogTeam", "payoutOdds", "reactivityScore", "alchemicalExplanation", "riskRating"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Underdog Bet API error:", error);
    return res.status(500).json({ error: error.message || "Failed to ignite the Bunsen Burner Bet." });
  }
});

// ==========================================================
// 3. HUSTLE GENERATOR API: The viability rating score
// ==========================================================
app.post("/api/hustle/generate", aiLimiter, async (req, res) => {
  try {
    const { idea, location, budget } = req.body;
    if (!idea || idea.trim() === "") {
      return res.status(400).json({ error: "Input your hustle vision idea (e.g., street boutique, barbershop pop-up, gourmet fusion cart) to transmute!" });
    }

    // FIX 4: Sanitize all user inputs
    const safeIdea = sanitizeInput(idea);
    const safeLocation = sanitizeInput(location || "Local Block");
    const safeBudget = sanitizeInput(budget || "minimal startup coins");

    const client = getGeminiClient();
    const prompt = `Transmute this hustle idea: "${safeIdea}" set in "${safeLocation}" on a budget of "${safeBudget}". Analyze the location viability, market data, and costs to produce local permits, check lists, pitch decks and a viability "The Formula" score out of 100. Deliver strictly conforming to JSON Schema.`;

    const response = await client.models.generateContent({
      // FIX 5: Correct model name
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Hood Alchemist Business Coach. You turn street ambition and minimal capital into highly scalable business blueprints.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING, description: "A catchy, alchemical street-level brand name for this hustle" },
            formulaScore: { type: Type.INTEGER, description: "Viability Formula Score from 0 to 100 based on demand, budget and location match" },
            viabilitySummary: { type: Type.STRING, description: "Rating viability description based on location demographics and startup cost" },
            businessPlan: { type: Type.STRING, description: "3-4 concise sentences detailing monetization models, overheads, and target audience" },
            startupChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "High priority quick step checklist to execute physically"
            },
            localPermits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific zoning, health, registration, or block street permits needed"
            },
            pitchDeck: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slide: { type: Type.STRING, description: "E.g., Slide 1: The Problem, Slide 2: The Alchemy, etc." },
                  content: { type: Type.STRING, description: "Core bullet or pitch sentence for this section" }
                },
                required: ["slide", "content"]
              },
              description: "A 5-part concise investor pitch deck framework"
            },
            launchStrategy: { type: Type.STRING, description: "A dynamic launching process leveraging TikTok, local event flyering, and street hype" }
          },
          required: ["businessName", "formulaScore", "viabilitySummary", "businessPlan", "startupChecklist", "localPermits", "pitchDeck", "launchStrategy"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Hustle Generator API error:", error);
    return res.status(500).json({ error: error.message || "Metals got stuck in the mould. Failed to generate hustle playbook." });
  }
});

// ==========================================================
// 4. AI NETWORKING / COLLABORATION MATCHMAKER API
// ==========================================================
app.post("/api/matchmaker/register", (req, res) => {
  try {
    const { name, skills, location, goals, avatar } = req.body;
    // FIX 6: Fixed typo "colllaboration" → "collaboration"
    if (!name || !skills || !goals) {
      return res.status(400).json({ error: "Roster name, specialized skills, and immediate collaboration goals are required!" });
    }

    const newProfile = {
      id: `user-${Date.now()}`,
      name,
      skills,
      location: location || "Remote Street Grid",
      goals,
      reputation: 60,
      avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };

    networkProfiles.unshift(newProfile);
    return res.json({ success: true, profile: newProfile, allProfiles: networkProfiles });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/matchmaker/matches", aiLimiter, async (req, res) => {
  try {
    const { profileId, skills, location, goals } = req.body;
    if (!skills || !goals) {
      return res.status(400).json({ error: "Create your card profile first to identify complementing chemistry matches." });
    }

    // FIX 4: Sanitize inputs used in prompt
    const safeSkills = sanitizeInput(skills);
    const safeGoals = sanitizeInput(goals);
    const safeLocation = sanitizeInput(location || "Any");

    const availableTargets = networkProfiles.filter(p => p.id !== profileId);

    const client = getGeminiClient();
    const prompt = `Find the top complementary collaborative matches for an artist/entrepreneur with:
- Skills: "${safeSkills}"
- Location: "${safeLocation}"
- Goals: "${safeGoals}"

Available community roster database:
${JSON.stringify(availableTargets, null, 2)}

Match with up to 3 complementary members. Conform strictly to JSON schema. Realistically compare complement zones (for example: a producer needs a rapper; a barber needs space; an apparel designer needs a printer).`;

    const response = await client.models.generateContent({
      // FIX 5: Correct model name
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Hood Alchemy Collaboration Matchmaker. You calculate complementary synergy scores and recommend street partnerships.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  profileId: { type: Type.STRING, description: "Match profile ID from the available roster database list" },
                  matchScore: { type: Type.INTEGER, description: "Synergy match score percentage out of 100" },
                  synergyExplanation: { type: Type.STRING, description: "2-3 sentences detailing why their skills and locations mesh elegantly" },
                  collabProject: { type: Type.STRING, description: "A highly viable suggested street-commercial project they should initiate" }
                },
                required: ["profileId", "matchScore", "synergyExplanation", "collabProject"]
              }
            }
          },
          required: ["matches"]
        }
      }
    });

    const matchesResult = JSON.parse(response.text || "{}");
    const formattedMatches = (matchesResult.matches || []).map((m: any) => {
      const matchProfile = networkProfiles.find(p => p.id === m.profileId);
      return {
        ...m,
        profile: matchProfile || {
          name: "Local Alchemist Spark",
          skills: "General street design",
          location: "South Central, LA",
          reputation: 75,
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
        }
      };
    });

    return res.json({ matches: formattedMatches });
  } catch (error: any) {
    console.error("Matchmaker API error:", error);
    const fallbacks = networkProfiles.slice(0, 3).map((p, idx) => ({
      profileId: p.id,
      profile: p,
      matchScore: 82 + idx * 5,
      synergyExplanation: "The complementary elemental patterns align automatically in your neighborhood coordinates. Perfect logistics overlap.",
      collabProject: "Joint capsule apparel release & promotional pop-up mixer."
    }));
    return res.json({ matches: fallbacks });
  }
});

// ==========================================================
// 5. COMMUNITY RADIO: 24/7 rotation and submissions with AI critique
// ==========================================================
app.get("/api/radio/rotation", (req, res) => {
  return res.json({ rotation: radioRotation });
});

app.post("/api/radio/submit", aiLimiter, async (req, res) => {
  try {
    const { title, artist, genre, demoLink } = req.body;
    if (!title || !artist || !genre) {
      return res.status(400).json({ error: "Song title, artist alias, and genre category are required to review!" });
    }

    // FIX 4: Sanitize user inputs used in prompt
    const safeTitle = sanitizeInput(title);
    const safeArtist = sanitizeInput(artist);
    const safeGenre = sanitizeInput(genre);

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      // FIX 5: Correct model name
      model: "gemini-2.0-flash",
      contents: `Critique this independent radio submission with standard alchemy metrics: 
Track: "${safeTitle}" by "${safeArtist}" (Genre: "${safeGenre}").
Analyze details and return isApproved (boolean, auto approve if it captures street passion, up to 95% rate), genreCategory, purificationScore (1 to 118 index, where 80+ is pure gold classic), chemistryReport (critique), barsOfGold (lyrical verse idea you write for them that would fit this track), and feedback (constructive improvement notes). Conform strictly to JSON.`,
      config: {
        systemInstruction: "You are the Alchemical Music Critic at Alchemist FM 79. You are extremely encouraging of independent artists, providing deep technical lyric critiques and beat recommendations with high culture relevance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isApproved: { type: Type.BOOLEAN, description: "Boolean indicating if track meets basic broadcasting frequency" },
            genreCategory: { type: Type.STRING, description: "The refined specific subgenre e.g., 'Warm Soul Boom-Bap' or 'Drift Drill'" },
            purificationScore: { type: Type.INTEGER, description: "Atomic Alchemy Scale rating from 1 to 118" },
            chemistryReport: { type: Type.STRING, description: "A detailed review detailing lyric structures, rhythm cadence and sonic chemistry (3-4 sentences)" },
            barsOfGold: { type: Type.STRING, description: "Write 2 bars of custom gold-grade hook/verse that matches this song concept perfectly" },
            feedback: { type: Type.STRING, description: "Deep actionable guidance explaining how they can refine this record further" }
          },
          required: ["isApproved", "genreCategory", "purificationScore", "chemistryReport", "barsOfGold", "feedback"]
        }
      }
    });

    const critique = JSON.parse(response.text || "{}");

    const newSong = {
      id: `track-${Date.now()}`,
      title,
      artist,
      genre: critique.genreCategory || genre,
      link: demoLink || "https://assets.mixkit.co/active_storage/sfx/2237/2237-84.wav",
      reputation: critique.purificationScore || 79,
      upvotes: 1,
      review: critique.chemistryReport,
      barsOfGold: critique.barsOfGold
    };

    radioRotation.push(newSong);

    return res.json({
      success: true,
      critique,
      newTrack: newSong,
      rotation: radioRotation
    });
  } catch (error: any) {
    console.error("Radio Critique API error:", error);
    const { title = "Sub-Frequency Compound", artist = "Anonymous Alchemist", genre = "Boom Bap", demoLink = "https://assets.mixkit.co/active_storage/sfx/2237/2237-84.wav" } = req.body || {};
    const mockCritique = {
      isApproved: true,
      genreCategory: genre + " (Impure Compound)",
      purificationScore: 78,
      chemistryReport: "Excellent mechanical potential. The flow slides nicely on the grid system, though the vocal coefficients have modest impurities.",
      barsOfGold: "'I count the hustle by the atomic mass, we keep it moving and we never bypass.'",
      feedback: "Double print the vocal layers in the chorus with a 15ms stereo spread to elevate the gold standard presence."
    };
    const fallbackTrack = {
      id: `track-${Date.now()}`,
      title,
      artist,
      genre: mockCritique.genreCategory,
      link: demoLink || "https://assets.mixkit.co/active_storage/sfx/2237/2237-84.wav",
      reputation: 78,
      upvotes: 1,
      review: mockCritique.chemistryReport,
      barsOfGold: mockCritique.barsOfGold
    };
    radioRotation.push(fallbackTrack);
    return res.json({
      success: true,
      critique: mockCritique,
      newTrack: fallbackTrack,
      rotation: radioRotation
    });
  }
});

app.post("/api/radio/upvote", (req, res) => {
  try {
    const { id } = req.body;
    const song = radioRotation.find(s => s.id === id);
    if (song) {
      song.upvotes += 1;
      return res.json({ success: true, song });
    }
    return res.status(404).json({ error: "Sountrack element not registered in this dial rotation." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Configure Vite integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hood Alchemy server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});

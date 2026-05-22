import { ElementSymbol, PodcastEpisode, AlbumReview, GuestProfile, MarketItem, BusinessListing } from "./types";

export const alchemyElements: ElementSymbol[] = [
  // MUSIC GROUP
  {
    symbol: "Hm",
    name: "Hip-Hop & Street Anthems",
    category: "Music",
    description: "The overarching sound of the neighborhood. Unvarnished stories, hard-hitting beats, and heavy bass.",
    atomicMass: 108,
    colorClass: "text-[#D4AF37]",
    bgGradient: "from-amber-600/20 to-amber-900/40",
    glowColor: "rgba(212, 175, 55, 0.4)"
  },
  {
    symbol: "Lr",
    name: "Lyric Breakdown & Bars",
    category: "Music",
    description: "The rhymes, wordplay, double entendres, storytelling flow, and messages hidden behind the verses.",
    atomicMass: 79,
    colorClass: "text-[#D4AF37]",
    bgGradient: "from-[#D4AF37]/10 to-transparent",
    glowColor: "rgba(212, 175, 55, 0.2)"
  },
  {
    symbol: "Pr",
    name: "Beat Making & Sound Design",
    category: "Music",
    description: "Crafting the beats. Classic MPC drum patterns, warm vinyl soul loops, and custom sub 808 glides.",
    atomicMass: 88,
    colorClass: "text-[#D4AF37]",
    bgGradient: "from-amber-700/15 to-transparent",
    glowColor: "rgba(212, 175, 55, 0.2)"
  },
  {
    symbol: "Tr",
    name: "Trap Music & Drill Beats",
    category: "Music",
    description: "Fast-rolling high-hat rhythms and sliding bass-lines reflecting modern fast-paced hustle energy.",
    atomicMass: 55,
    colorClass: "text-yellow-500",
    bgGradient: "from-yellow-600/10 to-transparent",
    glowColor: "rgba(234, 179, 8, 0.15)"
  },

  // CULTURE GROUP
  {
    symbol: "Hc",
    name: "Pop Culture & Gossip",
    category: "Culture",
    description: "The latest online trending news, viral commentary, television shows, and daily gossip reviews.",
    atomicMass: 112,
    colorClass: "text-emerald-400",
    bgGradient: "from-emerald-600/20 to-emerald-950/40",
    glowColor: "rgba(52, 211, 153, 0.4)"
  },
  {
    symbol: "St",
    name: "Relationships & Advice",
    category: "Culture",
    description: "Honest relationship debates, dating codes, family guidelines, and real street-smart perspective.",
    atomicMass: 94,
    colorClass: "text-emerald-500",
    bgGradient: "from-emerald-600/10 to-transparent",
    glowColor: "rgba(16, 185, 129, 0.2)"
  },
  {
    symbol: "Fs",
    name: "Streetwear & Fashion Swag",
    category: "Culture",
    description: "Wardrobe drops. Custom grillz, heavy cotton hoodies, limited sneakers, and aesthetic presentation.",
    atomicMass: 47,
    colorClass: "text-teal-400",
    bgGradient: "from-teal-600/10 to-transparent",
    glowColor: "rgba(45, 212, 191, 0.2)"
  },
  {
    symbol: "Hi",
    name: "Politics & Local News",
    category: "Culture",
    description: "Crucial local announcements, street politics, historical milestones, and advocacy updates on blocks.",
    atomicMass: 104,
    colorClass: "text-emerald-300",
    bgGradient: "from-emerald-500/10 to-transparent",
    glowColor: "rgba(110, 231, 183, 0.15)"
  },

  // SPORTS GROUP
  {
    symbol: "Hs",
    name: "Live Daily Sports Chat",
    category: "Sports",
    description: "Fast daily commentary on NBA, NFL, boxing matches, and top sports headlines.",
    atomicMass: 115,
    colorClass: "text-[#FF4500]",
    bgGradient: "from-orange-600/20 to-orange-950/40",
    glowColor: "rgba(255, 69, 0, 0.4)"
  },
  {
    symbol: "Sb",
    name: "Hoops & Street Playgrounds",
    category: "Sports",
    description: "Unsigned athletic playground tournaments. Hand-checks, physical play, and legendary local run stories.",
    atomicMass: 33,
    colorClass: "text-orange-500",
    bgGradient: "from-orange-600/10 to-transparent",
    glowColor: "rgba(249, 115, 22, 0.2)"
  },
  {
    symbol: "Pl",
    name: "Pro Sports Contracts & Talk",
    category: "Sports",
    description: "Evaluating million-dollar contracts, draft picks, general manager trades, and player associations.",
    atomicMass: 99,
    colorClass: "text-amber-500",
    bgGradient: "from-amber-600/10 to-transparent",
    glowColor: "rgba(245, 158, 11, 0.2)"
  },
  {
    symbol: "Ch",
    name: "Championship Mindset",
    category: "Sports",
    description: "Unwavering elite focus, athletic routines, mental stamina, and winning when pressure is highest.",
    atomicMass: 84,
    colorClass: "text-red-500",
    bgGradient: "from-red-600/10 to-transparent",
    glowColor: "rgba(239, 68, 68, 0.2)"
  },

  // BUSINESS GROUP
  {
    symbol: "Hb",
    name: "Local Neighborhood Business",
    category: "Business",
    description: "Showcasing and supporting local shops, brick-and-mortars, and independent neighborhood businesses.",
    atomicMass: 114,
    colorClass: "text-sky-400",
    bgGradient: "from-sky-600/20 to-sky-950/40",
    glowColor: "rgba(56, 189, 248, 0.4)"
  },
  {
    symbol: "Sh",
    name: "Trunk Economies & Hustles",
    category: "Business",
    description: "Micro-businesses, unlicensed trade, custom merchandise, pop-up apparel sales, and fast income.",
    atomicMass: 62,
    colorClass: "text-sky-500",
    bgGradient: "from-sky-600/10 to-transparent",
    glowColor: "rgba(14, 165, 233, 0.2)"
  },
  {
    symbol: "Fl",
    name: "Financial Literacy Advice",
    category: "Business",
    description: "Navigating bank accounts, improving credit scores, investment assets, and building family wealth.",
    atomicMass: 92,
    colorClass: "text-indigo-400",
    bgGradient: "from-indigo-600/10 to-transparent",
    glowColor: "rgba(129, 140, 248, 0.2)"
  },
  {
    symbol: "Br",
    name: "Brand Building & Design",
    category: "Business",
    description: "How to craft logos, design high-quality graphics, order blank samples, and tell brand stories.",
    atomicMass: 50,
    colorClass: "text-cyan-400",
    bgGradient: "from-cyan-600/10 to-transparent",
    glowColor: "rgba(34, 211, 238, 0.2)"
  },

  // GUESTS GROUP
  {
    symbol: "Hg",
    name: "Roundtable Guest Panels",
    category: "Guests",
    description: "Invited neighborhood leaders and commentators adding distinct perspectives around the table.",
    atomicMass: 118,
    colorClass: "text-purple-400",
    bgGradient: "from-purple-600/20 to-purple-950/40",
    glowColor: "rgba(192, 132, 252, 0.4)"
  },
  {
    symbol: "Ca",
    name: "Content Creators & Artists",
    category: "Guests",
    description: "Writers, visual artists, dropshippers, and independent musicians showcasing their work on our show.",
    atomicMass: 80,
    colorClass: "text-purple-500",
    bgGradient: "from-purple-600/10 to-transparent",
    glowColor: "rgba(168, 85, 247, 0.2)"
  },
  {
    symbol: "Cp",
    name: "Local Store Owners",
    category: "Guests",
    description: "Brick-and-mortar founders, shopkeepers, and localized service operators speaking about their journeys.",
    atomicMass: 82,
    colorClass: "text-[#D4AF37]",
    bgGradient: "from-[#D4AF37]/10 to-transparent",
    glowColor: "rgba(212, 175, 55, 0.2)"
  },
  {
    symbol: "Re",
    name: "Athletes, Analysts & Coaches",
    category: "Guests",
    description: "Regional athletic leaders, boxers, basketball coaches, and talent evaluators dropping breakdown stats.",
    atomicMass: 86,
    colorClass: "text-pink-500",
    bgGradient: "from-pink-600/10 to-transparent",
    glowColor: "rgba(236, 72, 153, 0.2)"
  }
];

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep-04",
    number: "Daily Show - Broadcast #124",
    title: "Pop Culture Daily: Viral Gossip & Street News",
    description: "Our daily briefing on trending social media news, celebrity gossip, hot relationship debacles, and local reports. We keep the neighborhood connected with what's actually happening today.",
    duration: "45:10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    date: "Today (Daily)",
    ratingIndex: 94,
    elements: ["Hc", "Hi", "St"],
    actStructure: {
      crucible: "Today's opening review of viral topics sweeping Instagram, TikTok, and local neighborhood streets.",
      baseMetals: "Relationship Debates: Discussing why modern communication fails on early dates, or how street codes play a role.",
      reaction: "Street News Report: Evaluating changes in community development and zoning rules affecting local block areas.",
      transmutation: "Trending Music Updates: Quick review of surprise mixtape drops from local independent talent.",
      goldStandard: "Community Spotlight: Honoring a corner store owner providing healthy, clean options to residents.",
      residue: "Playing real fan voicemails from our 'Bunsen Burner' feedback line."
    },
    featuredGuest: "Sasha Rogers (Culture Reporter)"
  },
  {
    id: "ep-03",
    number: "Weekly Show - Vol. 32",
    title: "Shade45 Beat-Hustle: Ground Zero DJ Radio Mix",
    description: "A high-octane 1-hour radio slot styled as a classic Shade45 mixtape segment. Sway Rogers host reviews, scratch DJ blends, exclusive freestyle bars, and live beat breakdowns from local producers.",
    duration: "1:08:44",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    date: "Every Tuesday (Weekly)",
    ratingIndex: 82,
    elements: ["Hm", "Lr", "Pr"],
    actStructure: {
      crucible: "Intro monologue on the evolution of vinyl loops and raw boom-bap drum sampling.",
      baseMetals: "The Lyricist Desk: Deconstructing the rhymes and clever double meanings of new underground rap releases.",
      reaction: "Beat-making Showcase: Breaking down a classic MPC 2000 setup and how soulful organ chords are mixed with tough sub bass lines.",
      transmutation: "Exclusive Studio Freestyle: Live mixtape broadcast featuring guest bars and street freestyle battles.",
      goldStandard: "Radio Legends: Celebrating historical DJs who pioneered mixtape distribution networks in Brooklyn and Los Angeles.",
      residue: "Sponsor alerts, street feedback calls, and a recap of upcoming community popup workshops."
    },
    featuredGuest: "Sway Rogers (Guerilla DJ Setup)"
  },
  {
    id: "ep-02",
    number: "Weekly Show - Vol. 15",
    title: "The Sports Turf: Playground Battles & Pro Money",
    description: "Our weekly sports roundtable debating the NBA championship standings, local streetball tournament bragging rights, and critical breakdowns of draft pick player contracts.",
    duration: "1:15:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    date: "Every Thursday (Weekly)",
    ratingIndex: 112,
    elements: ["Hs", "Sb", "Pl"],
    actStructure: {
      crucible: "Intro rules of the court list. If you can handle a high pick-and-roll at Rucker, you are ready for any corporate boardroom.",
      baseMetals: "NBA Playoff Predictor: Discussing GM trades, contract metrics, and the latest MVP race highlights.",
      reaction: "Streetball Tournaments: Outlining regional summer leagues, handcheck parameters, and raw physical playground match-ups.",
      transmutation: "Sports Agent Focus: Explaining how young athletes can structure modern endorsement royalty models.",
      goldStandard: "Sovereignty Code: Retaining ownership in local community athletic programs rather than corporate licensing.",
      residue: "Taking caller questions about basketball brackets and athletic training programs."
    },
    featuredGuest: "Coach Vance (Eastside Run Coordinator)"
  },
  {
    id: "ep-01",
    number: "Bi-Weekly Show - Vol. 08",
    title: "Street Politics: Financial Literacy & Local Voices",
    description: "A bi-weekly deep dive on building actual wealth. We outline how local businesses navigate credit, start trunk economies, and use brand design to establish long-term financial security.",
    duration: "1:32:10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    date: "Bi-Weekly (Every 2nd Friday)",
    ratingIndex: 118,
    elements: ["Hb", "Sh", "Fl"],
    actStructure: {
      crucible: "The Core Blueprint: Explaining why financial literacy is the absolute foundation required to support street enterprises.",
      baseMetals: "Financial Clinic: Common-sense tips to escape high-interest debt loops and establish credit registry accounts.",
      reaction: "Trunk Economies: Organizing custom merchandise drops, popup stores, and neighborhood trade collectives.",
      transmutation: "Brand Guide: Creating high-visibility graphic logos and telling your local company story with pride.",
      goldStandard: "Cooperative Economics: Pooling neighborhood investment funds to acquire local retail storefronts.",
      residue: "Answering community voicemail requests on finding affordable manufacturing samples."
    },
    featuredGuest: "Marcus 'Fresh' Miller (Director of Trust Funds)"
  }
];

export const albumReviews: AlbumReview[] = [
  {
    id: "rev-1",
    artist: "Kendrick Lamar",
    album: "Grounded in Gold",
    releaseYear: 2026,
    overallScore: 115,
    ratings: {
      Lr: 118,
      Pr: 112,
      Cw: 116,
      Rv: 110,
      Ch: 114
    },
    reviewText: "A masterwork of audio chemistry. Kendrick takes raw, unvarnished narratives from California streets and subjects them to highly pressurized lyrical extraction. The soul samples represent pure gold, while the sliding bass lines and sparse percussion keep the baseline gritty, real, and authentic. A standard of alchemical performance.",
    transmutedValue: "Pure Gold",
    releaseCover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "rev-2",
    artist: "Metro Boomin & Co.",
    album: "Metabolic Baselines",
    releaseYear: 2025,
    overallScore: 92,
    ratings: {
      Lr: 75,
      Pr: 116,
      Cw: 88,
      Rv: 104,
      Ch: 78
    },
    reviewText: "Production standard is through the ceiling. Metro uses an complex combination of synthesizers, orchestral choirs, and heavy sub bass. The cohesion is slightly disrupted by too many features, but individual reactions are highly volatile and exciting. Excellent club replay values, though slightly thin on raw narrative lyricism.",
    transmutedValue: "Refined Chemistry",
    releaseCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "rev-3",
    artist: "Eastside Youngin",
    album: "Pressure Cooker",
    releaseYear: 2026,
    overallScore: 38,
    ratings: {
      Lr: 42,
      Pr: 35,
      Cw: 45,
      Rv: 30,
      Ch: 38
    },
    reviewText: "Very rough around the margins. Recorded on a low-end USB microphone in a closet, showing extreme raw potential but highly volatile output. The beat selections are generic loop files. However, the raw delivery has active heat and real street integrity. Needs professional alchemical refining inside a studio reaction chamber.",
    transmutedValue: "Raw Potential",
    releaseCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const guestProfiles: GuestProfile[] = [
  {
    id: "gst-1",
    name: "KB of Custom Teeth & Grillz",
    type: "Compound",
    role: "Aesthetic Jeweler & Community Liaison",
    bio: "KB started doing dental molds in the backseat of his coupe. Today he runs three custom design centers, shaping gold smiles for musicians, streetballers, and business leaders while running financial literacy camps for teenagers on the block.",
    elementSymbol: "Cp",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    currentTransmutation: "Creating 100% recyclable, ethically sourced gold caps to keep community wealth within local supply chains.",
    pastEpisodeNumber: "Episode 4",
    socials: { instagram: "kb_grillz_lab", website: "https://kb-gold-molds.com" }
  },
  {
    id: "gst-2",
    name: "Coach Vance",
    type: "Reagent",
    role: "Founder, Eastside Athletic Run",
    bio: "Coach Vance played professional ball overseas but returned to Compton to build a self-funded basketball league. He teaches young ballers the 'Streetball + Suite Strategy'—leveraging physical competitiveness to unlock brand sponsorships and business logic.",
    elementSymbol: "Re",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    currentTransmutation: "Securing micro-sponsorships from minor local business owners to upgrade outdoor asphalt courts to professional standard glass backboards.",
    pastEpisodeNumber: "Episode 2",
    socials: { twitter: "vance_eastside", instagram: "eastside_run" }
  },
  {
    id: "gst-3",
    name: "Guerilla Silk (Sway)",
    type: "Catalyst",
    role: "Avant-Garde Streetwear Architect",
    bio: "Sway Rogers transforms vintage military surplus gear and heavy canvas grain patterns into high-fashion graphic products. Her drops sell out in mere minutes on Telegram chat groups using alchemical scarcity marketing.",
    elementSymbol: "Ca",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    currentTransmutation: "Using hand-mixed base textile dyes sourced from natural local clay elements to print historical activist statements.",
    pastEpisodeNumber: "Episode 3",
    socials: { instagram: "guerilla_silk_lab" }
  }
];

export const marketplaceItems: MarketItem[] = [
  {
    id: "item-1",
    name: "Alchemy Heavy Chamber Hoodie",
    price: "$75.00",
    category: "Apparel",
    imagePrompt: "Heavyweight asphalt black oversized streetwear hoodie with metallic gold foil periodic table square detailing Hm Lr on the chest.",
    description: "450GSM ultra-dense organic cotton fleece in Crucible Black, featuring screen-printed alchemy chart markings and heavy embroidered metallic Alchemy Gold lettering. Fits relaxed with a dropped shoulder structure.",
    purityBadge: "Purity Index: 118"
  },
  {
    id: "item-2",
    name: "The Borosilicate Transmutation Beaker",
    price: "$45.00",
    category: "Lab Equipment",
    imagePrompt: "A sleek scientific borosilicate glass lab beaker with a black handle and yellow-gold measuring markings and Hood Alchemy logo.",
    description: "Lab-grade thick borosilicate beaker glass for mixing coffee, tea, or creative reactions. Heat-resistant, complete with an etched alchemical element chart (Hm, Hc, Hs, Hb, Hg).",
    purityBadge: "Lab Tested"
  },
  {
    id: "item-3",
    name: "Official Alchemy Element Blueprint",
    price: "$25.00",
    category: "Print",
    imagePrompt: "High-contrast technical retro alchemical periodic chart poster in matte dark iron slate with weathered gold grid borders.",
    description: "Heavy stock 18x24 satin poster print. Highly detailed grid breakdown of regional street elements, hip-hop history milestones, and cultural chemical indexes. Essential chamber decor.",
    purityBadge: "Collector's Archive"
  }
];

export const localBusinesses: BusinessListing[] = [
  {
    id: "biz-1",
    name: "Drip Extraction Juice Lab",
    ownerName: "Marcus 'Fresh' Miller",
    hustleCategory: "Health & Nutrition",
    description: "We cold-press raw local fruits and wild alkaline herbs in real-time, removing raw sugars to extract high-yield chlorophyll shots and organic stamina elixirs for community health.",
    formulaTip: "Convert base local produce into premium health assets. Never import concentrate when you can crush natural beets near the block.",
    location: "Slauson Ave (Crenshaw District)",
    link: "https://drip-extraction-juice.com"
  },
  {
    id: "biz-2",
    name: "Crown Craft Bindery & Bookstore",
    ownerName: "Naima Jenkins & Bilal Ali",
    hustleCategory: "Intellectual Refinery",
    description: "A collective space sourcing rare self-published radical books, historical hip-hop photographic diaries, and teaching hand-stitch leather-bound journaling courses to neighborhood kids.",
    formulaTip: "Branding the intellect is the highest asset. Bind street stories in premium leather and present literature with absolute luxury style.",
    location: "Flatbush Avenue (Brooklyn, NY)",
    link: "https://crown-craft-bindery.com"
  },
  {
    id: "biz-3",
    name: "Box State Audio Repairs",
    ownerName: "Regie 'Capacitor' Banks",
    hustleCategory: "Analog Recovery",
    description: "Rescuing vintage analog audio consoles, cassette decks, 808 synthesizers, and vacuum tube amplifiers from local scrap collection yards and restoring their original warm tone waves.",
    formulaTip: "Base metal salvage. The highest margin is in cleaning and recalibrating the dusty analog gear everyone else threw in the dumpster.",
    location: "Zone 3 (Atlanta, GA)",
    link: "https://box-state-console-repair.com"
  }
];

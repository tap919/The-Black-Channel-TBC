import { useState, useEffect } from "react";
import { 
  Radio, 
  Mic, 
  Briefcase, 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  Info,
  Youtube
} from "lucide-react";
import { podcastEpisodes } from "./data";
import AudioPlayerSection from "./components/AudioPlayerSection";

// Atmospheric Ambient Sound loops for our Home Soundboard.
const AMBIENT_TRACKS = [
  { id: "rain", label: "Slauson Rain", url: "https://assets.mixkit.co/active_storage/sfx/1657/1657-84.wav" },
  { id: "vinyl", label: "Vinyl Crackle", url: "https://assets.mixkit.co/active_storage/sfx/2237/2237-84.wav" },
  { id: "basketball", label: "Rucker Ball Bounce", url: "https://assets.mixkit.co/active_storage/sfx/1012/1012-84.wav" },
  { id: "drone", label: "Sub 808 Drone", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "radio" | "podcasts" | "hustle" | "sportsbook">("home");
  const [userCoins, setUserCoins] = useState(50);

  // --- AUDIO SOUNDBOARD STATE ---
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  const [soundVolumes, setSoundVolumes] = useState<Record<string, number>>({
    rain: 50,
    vinyl: 60,
    basketball: 40,
    drone: 30
  });

  // Keep references of HTML5 Audio elements
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Warm up the audio cache
    const initialAudios: Record<string, HTMLAudioElement> = {};
    AMBIENT_TRACKS.forEach(track => {
      const a = new Audio(track.url);
      a.loop = true;
      initialAudios[track.id] = a;
    });
    setAudioElements(initialAudios);

    return () => {
      // Cleanup audio nodes on unmount
      Object.values(initialAudios).forEach(a => a.pause());
    };
  }, []);

  const toggleSound = (id: string) => {
    const audio = audioElements[id];
    if (!audio) return;

    if (activeSounds[id]) {
      audio.pause();
      setActiveSounds(prev => ({ ...prev, [id]: false }));
    } else {
      audio.volume = (soundVolumes[id] ?? 50) / 100;
      audio.play().catch(err => console.warn("Interactivity policy blocked autoplays:", err));
      setActiveSounds(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleVolumeChange = (id: string, vol: number) => {
    setSoundVolumes(prev => ({ ...prev, [id]: vol }));
    const audio = audioElements[id];
    if (audio) {
      audio.volume = vol / 100;
    }
  };

  // --- ARTIST RADIO SUBMISSIONS STATE ---
  const [radioTitle, setRadioTitle] = useState("");
  const [radioArtist, setRadioArtist] = useState("");
  const [radioGenre, setRadioGenre] = useState("");
  const [radioDemoLink, setRadioDemoLink] = useState("");
  const [isSubmittingRadio, setIsSubmittingRadio] = useState(false);
  const [radioError, setRadioError] = useState<string | null>(null);
  const [radioSuccessCritique, setRadioSuccessCritique] = useState<any | null>(null);
  const [activeRotationPlay, setActiveRotationPlay] = useState<any>({
    id: "track-1",
    title: "Slauson Renaissance",
    artist: "King Kendrick Jr.",
    genre: "Soulful Boom-Bap",
    reputation: 96,
    upvotes: 142
  });
  const [radioRotationList, setRadioRotationList] = useState<any[]>([
    {
      id: "track-1",
      title: "Slauson Renaissance",
      artist: "King Kendrick Jr.",
      genre: "Soulful Boom-Bap",
      reputation: 96,
      upvotes: 142
    },
    {
      id: "track-2",
      title: "Sliding Ratios",
      artist: "Trap Chemist",
      genre: "High-Reactive Drill",
      reputation: 89,
      upvotes: 89
    }
  ]);

  // Load rotation from server initially
  useEffect(() => {
    fetch("/api/radio/rotation")
      .then(res => res.json())
      .then(data => {
        if (data && data.rotation && data.rotation.length > 0) {
          const mapped = data.rotation.map((r: any) => ({
            id: r.id,
            title: r.title,
            artist: r.artist,
            genre: r.genre,
            reputation: r.reputation || 90,
            upvotes: r.upvotes || 1
          }));
          setRadioRotationList(mapped);
          setActiveRotationPlay(mapped[0]);
        }
      })
      .catch(err => console.error("Could not fetch server radio presets", err));
  }, []);

  // --- BUSINESS HUSTLE STATE ---
  const [hustleIdea, setHustleIdea] = useState("");
  const [hustleLocation, setHustleLocation] = useState("");
  const [hustleBudget, setHustleBudget] = useState("");
  const [isHustling, setIsHustling] = useState(false);
  const [hustleError, setHustleError] = useState<string | null>(null);
  const [hustleResult, setHustleResult] = useState<any | null>(null);

  // --- SPORTSBOOK STATE ---
  const [liveOddsGames, setLiveOddsGames] = useState<any[]>([]);
  const [isOddsSyncing, setIsOddsSyncing] = useState(false);
  const [sportsLineup, setSportsLineup] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [sportsError, setSportsError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  const [burnerBet, setBurnerBet] = useState<any | null>(null);
  const [isIgnitingBurner, setIsIgnitingBurner] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([
    { id: "sp-1", selection: "Lakers vs Celtics", userGuess: "win", outcome: "WIN (+10 Coins)", resolved: true, correct: true },
    { id: "sp-2", selection: "Chiefs vs Bills", userGuess: "win", outcome: "Pushed to Overtime", resolved: false }
  ]);

  // Fetch upcoming sports odds with dynamic date relative offsets
  const syncLiveOdds = () => {
    setIsOddsSyncing(true);
    fetch("/api/sports/odds")
      .then(res => res.json())
      .then(data => {
        if (data && data.games) {
          setLiveOddsGames(data.games);
        }
      })
      .catch(err => console.error("Error loaded live odds:", err))
      .finally(() => setIsOddsSyncing(false));
  };

  useEffect(() => {
    syncLiveOdds();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col relative overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]" id="press-network-root">
      
      {/* Real Metallic Gold Foil Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-90 z-50"></div>

      {/* Grid Wall Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-900 z-10" id="main-header">
        
        {/* Logo & Brand Identity */}
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-2">
            <span className="p-1 px-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[#D4AF37] font-mono text-[10px] font-bold leading-none tracking-wider uppercase">
              TPN • Live
            </span>
            <span className="text-[9px] font-mono tracking-wider text-stone-500 uppercase">
              Grown Culture Airwaves
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mt-1 leading-none select-none">
            The Press <span className="text-[#D4AF37]">Network</span>
          </h1>
          
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8C8C8C] mt-2 font-semibold">
            Community Radio • Podcasts • Business Hustle Blueprints • Real Odds predictions
          </span>
        </div>

        {/* Global Navigation Tabs (Only 5 key options!) */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold border-t sm:border-t-0 border-stone-900 pt-3 sm:pt-0" id="global-tabs">
          <button 
            onClick={() => setActiveTab("home")} 
            className={`pb-1 transition-all border-b-2 cursor-pointer ${activeTab === "home" ? "text-[#D4AF37] border-[#D4AF37]" : "text-stone-400 border-transparent hover:text-white"}`}
            id="tab-btn-home"
          >
            🏡 Home
          </button>
          
          <button 
            onClick={() => setActiveTab("radio")} 
            className={`pb-1 transition-all border-b-2 cursor-pointer ${activeTab === "radio" ? "text-white border-[#D4AF37]" : "text-stone-400 border-transparent hover:text-white"}`}
            id="tab-btn-radio"
          >
            📻 Artist Radio
          </button>
          
          <button 
            onClick={() => setActiveTab("podcasts")} 
            className={`pb-1 transition-all border-b-2 cursor-pointer ${activeTab === "podcasts" ? "text-white border-[#D4AF37]" : "text-stone-400 border-transparent hover:text-white"}`}
            id="tab-btn-podcasts"
          >
            🎙️ Podcasts & Shows
          </button>
          
          <button 
            onClick={() => setActiveTab("hustle")} 
            className={`pb-1 transition-all border-b-2 cursor-pointer ${activeTab === "hustle" ? "text-white border-[#D4AF37]" : "text-stone-400 border-transparent hover:text-white"}`}
            id="tab-btn-hustle"
          >
            💼 Business Ideas
          </button>

          <button 
            onClick={() => setActiveTab("sportsbook")} 
            className={`pb-1 transition-all border-b-2 cursor-pointer ${activeTab === "sportsbook" ? "text-white border-[#D4AF37]" : "text-stone-400 border-transparent hover:text-white"}`}
            id="tab-btn-sportsbook"
          >
            ⚽ Daily Sports Picks
          </button>
        </nav>
      </header>

      {/* CORE FRAME CONTENT CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-12 z-10" id="main-content-canvas">
        
        {/* ==========================================
            VIEW 1: HOME LANDING DESK & AMBIENT MIXER 
            ========================================== */}
        {activeTab === "home" && (
          <div className="space-y-8 text-left animate-fadeIn" id="home-view">
            
            {/* Banner Statement */}
            <div className="bg-gradient-to-r from-stone-950 via-stone-900/60 to-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-850 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold bg-[#D4AF37]/10 px-2 py-1 rounded">
                  Broadcasting Live from South LA
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Welcome to The Press
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                  A dedicated home for grown hip-hop audiences. We bring you real, authentic street radio on-demand, polished cultural podcasts, a custom start-up hustle planning system, and daily analytics-backed sports book advice with live betting line indicators.
                </p>
              </div>

              {/* Coins Widget Badge */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg w-max self-start font-mono flex-shrink-0">
                <Coins className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                <div>
                  <span className="text-[9px] text-[#D4AF37] uppercase block font-black">Culture points</span>
                  <span className="text-lg font-black text-white">{userCoins} Points</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Directory navigation cards (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="border-b border-stone-900 pb-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase">
                    Core Media Channels
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Artist Radio Station", desc: "Submit your demos to earn instant ratings, mastering guides, and AI-Suggested original lyrics.", tab: "radio" as const, icon: Radio, text: "Enter Station airwaves" },
                    { title: "Podcasts & Shows", desc: "Tune in to on-demand hip-hop talk shows, complete with weekly interactive segment timeline indexers.", tab: "podcasts" as const, icon: Mic, text: "Open Console playback" },
                    { title: "Business Hustle Router", desc: "Formulate physical startup plans, licensing permits, social drafts, and budget outlines on the fly.", tab: "hustle" as const, icon: Briefcase, text: "Generate Playbook" },
                    { title: "Daily Live Sports Picks", desc: "Analyze player matchup lineups, player notes, injuries, with real head-to-head live odds indicators.", tab: "sportsbook" as const, icon: Flame, text: "Check Predictor Lines" }
                  ].map((chan) => (
                    <button
                      key={chan.title}
                      onClick={() => setActiveTab(chan.tab)}
                      className="p-5 bg-stone-950 border border-stone-850 hover:border-[#D4AF37]/50 rounded-2xl text-left transition-all hover:-translate-y-1 block hover:bg-stone-900/10 cursor-pointer duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-[#D4AF37]">
                          <chan.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">PORT »</span>
                      </div>
                      
                      <h4 className="text-md font-bold text-white uppercase mt-4">{chan.title}</h4>
                      <p className="text-xs text-stone-400 font-light mt-1.5 leading-relaxed">{chan.desc}</p>
                      
                      <div className="mt-4 flex items-center text-[10px] font-mono uppercase text-stone-300 font-bold">
                        <span>{chan.text}</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#D4AF37]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Immersive Ambient Mixer (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border-b border-[#D4AF37]/20 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-black tracking-widest text-[#D4AF37] uppercase flex items-center space-x-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>Atmospheric Ambient Mixer</span>
                  </h3>
                  <span className="text-[8px] font-mono text-stone-500 uppercase bg-stone-900 px-2 py-0.5 rounded">Stereo</span>
                </div>

                <div className="bg-stone-950 p-6 rounded-2xl border border-stone-850 space-y-5">
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    Establish a smooth mood backdrop. Toggle any of these vintage, high-comfort background sounds and tailor their individual volume sliders.
                  </p>

                  <div className="space-y-4 pt-2">
                    {AMBIENT_TRACKS.map((track) => {
                      const isActive = activeSounds[track.id];
                      return (
                        <div key={track.id} className="p-3.5 bg-stone-900/60 rounded-xl border border-stone-850 flex flex-col gap-3 font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase">{track.label}</span>
                            <button
                              onClick={() => toggleSound(track.id)}
                              className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all tracking-wider cursor-pointer ${isActive ? "bg-emerald-600 text-stone-950" : "bg-stone-950 text-stone-500 hover:text-stone-300"}`}
                            >
                              {isActive ? "Playing" : "Muted"}
                            </button>
                          </div>

                          <div className="flex items-center space-x-2.5">
                            <span className="text-stone-500 text-[10px]">VOL</span>
                            <input 
                              type="range"
                              min="0"
                              max="100"
                              value={soundVolumes[track.id]}
                              onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
                              disabled={!isActive}
                              className="flex-grow h-1 bg-stone-950 appearance-none rounded-lg accent-[#D4AF37] disabled:opacity-30 cursor-pointer"
                            />
                            <span className="text-[10px] text-stone-500 w-8 text-right">{soundVolumes[track.id]}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 2: ARIST COMMUNITY RADIO TRANSMITTER
            ========================================== */}
        {activeTab === "radio" && (
          <div className="space-y-8 text-left animate-fadeIn" id="artist-radio-view">
            
            {/* Header */}
            <div className="border-b border-stone-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center space-x-2 animate-pulse">
                  <Radio className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Press FM • On-Air Submissions Desk</span>
                </span>
                <h3 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
                  Artist Radio & AI Track Feedback
                </h3>
                <p className="text-xs text-stone-400 mt-2 max-w-2xl leading-relaxed">
                  Submit independent track information to earn an instant review on lyrics, production and mixing quality. Plus, write original AI suggestions to refine your hooks!
                </p>
              </div>
              <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 flex items-center space-x-3 shadow-lg font-mono flex-shrink-0">
                <Coins className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[9px] text-[#D4AF37] uppercase block font-black">Culture points</span>
                  <span className="text-sm font-bold text-white">{userCoins} Points</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Submissions desk form (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850 space-y-5">
                  <h4 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold border-b border-stone-900 pb-2 flex items-center justify-between">
                    <span>TRACK CONSOLE DESK</span>
                    <span className="text-[9px] text-stone-500 normal-case font-light text-right">Cost: 1 Point</span>
                  </h4>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!radioTitle || !radioArtist || !radioGenre) {
                        setRadioError("Song title, artist name, and genre are required fields!");
                        return;
                      }
                      if (userCoins < 1) {
                        setRadioError("Not enough Culture Points! Upvote tracks below to earn coins first.");
                        return;
                      }

                      setIsSubmittingRadio(true);
                      setRadioError(null);
                      setRadioSuccessCritique(null);

                      try {
                        const res = await fetch("/api/radio/submit", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: radioTitle,
                            artist: radioArtist,
                            genre: radioGenre,
                            demoLink: radioDemoLink
                          })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);

                        if (data.rotation) {
                          setRadioRotationList(data.rotation.map((r: any) => ({
                            id: r.id,
                            title: r.title,
                            artist: r.artist,
                            genre: r.genre,
                            reputation: r.reputation || 90,
                            upvotes: r.upvotes || 1
                          })));
                        }
                        setRadioSuccessCritique(data.critique);
                        setUserCoins(c => c - 1);
                        
                        if (data.newTrack) {
                          setActiveRotationPlay({
                            id: data.newTrack.id,
                            title: data.newTrack.title,
                            artist: data.newTrack.artist,
                            genre: data.newTrack.genre,
                            reputation: data.newTrack.reputation || 90,
                            upvotes: data.newTrack.upvotes || 1
                          });
                        }

                        // Reset fields
                        setRadioTitle("");
                        setRadioArtist("");
                        setRadioGenre("");
                        setRadioDemoLink("");
                      } catch (err: any) {
                        setRadioError(err.message || "Could not generate AI track review.");
                      } finally {
                        setIsSubmittingRadio(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 font-bold uppercase block">Track Title *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Crenshaw Sunset"
                          value={radioTitle}
                          onChange={(e) => setRadioTitle(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700 focus:border-[#D4AF37]/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 font-bold uppercase block">Artist Alias *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. MC Catalyst"
                          value={radioArtist}
                          onChange={(e) => setRadioArtist(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700 focus:border-[#D4AF37]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 font-bold uppercase block">Core Genre *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Boom-Bap, Trap, R&B"
                          value={radioGenre}
                          onChange={(e) => setRadioGenre(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700 focus:border-[#D4AF37]/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 font-bold uppercase block">Demo Link (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Soundcloud URL, etc."
                          value={radioDemoLink}
                          onChange={(e) => setRadioDemoLink(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700 focus:border-[#D4AF37]/50"
                        />
                      </div>
                    </div>

                    {radioError && (
                      <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-100 rounded text-xs select-none text-left">
                        {radioError}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={isSubmittingRadio}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#ebd074] disabled:bg-stone-850 disabled:text-stone-600 text-stone-950 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 uppercase"
                    >
                      {isSubmittingRadio ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full" />
                          <span>Critiquing Beat Waves...</span>
                        </>
                      ) : (
                        <span>Submit demo for AI Feedback</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* AI Review Report Output Card */}
                {radioSuccessCritique && (
                  <div className="bg-[#121111] p-5 rounded-2xl border-2 border-[#D4AF37]/50 space-y-4 shadow-xl text-left animate-fadeIn">
                    <div>
                      <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider block">
                        THE PRESS AUDITED REPORT
                      </span>
                      <h4 className="text-md font-bold text-stone-200 uppercase mt-1">
                        Song rating & Mastering critique
                      </h4>
                    </div>

                    <div className="space-y-3 font-sans text-stone-300 text-xs">
                      <div className="flex justify-between items-center bg-stone-950 p-2.5 rounded border border-stone-900">
                        <div>
                          <span className="text-stone-500 font-mono text-[8px] uppercase block">Grade Classification</span>
                          <span className="text-white font-mono uppercase font-bold">{radioSuccessCritique.genreCategory}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-500 font-mono text-[8px] block">Track Score</span>
                          <span className="text-[#D4AF37] font-mono font-black text-sm">AU {radioSuccessCritique.purificationScore}/118</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Sonic production & Flow feedback:</span>
                        <p className="text-stone-300 font-light leading-relaxed mt-1 text-xs">{radioSuccessCritique.chemistryReport}</p>
                      </div>

                      <div className="p-3 bg-stone-950 border border-stone-900 rounded-xl space-y-1">
                        <span className="text-[#D4AF37] font-mono text-[9px] font-bold uppercase block">
                          ★ RECOMMENDED NEW LYRICAL HOOK SUGGEST:
                        </span>
                        <p className="text-[#D4AF37] font-mono italic text-[11px] leading-relaxed mt-1">
                          {radioSuccessCritique.barsOfGold}
                        </p>
                      </div>

                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase block font-bold">Actionable Mixing Suggestions:</span>
                        <p className="text-stone-400 font-light leading-relaxed mt-1">{radioSuccessCritique.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Live catalog list and rotating record deck (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Audio Deck Vinyl Box */}
                <div className="bg-stone-950 border border-stone-850 p-5 rounded-2xl relative overflow-hidden text-left shadow-2xl">
                  <div className="absolute top-4 right-4 flex items-center space-x-1.5 font-mono text-[9px] text-[#D4AF37]">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse border border-black" />
                    <span className="font-bold tracking-widest uppercase">AIRWAVE ROTATION</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Spinning Vinyl Record Disc layout */}
                    <div className="relative select-none flex-shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black border-4 border-stone-800 flex items-center justify-center relative shadow-xl animate-spin" style={{ animationDuration: '6s' }}>
                        <div className="absolute inset-2 border border-stone-900 rounded-full" />
                        <div className="absolute inset-4 border border-stone-900 rounded-full" />
                        <div className="absolute inset-6 border border-stone-900 rounded-full" />
                        
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                          <span className="text-[7px] text-stone-950 font-black font-mono tracking-tighter uppercase text-center max-w-full truncate px-1">
                            {activeRotationPlay?.artist || "CRUCIBLE"}
                          </span>
                        </div>
                        <div className="absolute inset-0 m-auto w-2 h-2 bg-[#0A0A0A] rounded-full border border-stone-600" />
                      </div>
                      <div className="absolute top-0 right-2 w-10 h-12 border-t-2 border-r-2 border-stone-600 rounded-tr-lg pointer-events-none transform rotate-12 origin-top-right scale-y-110" />
                    </div>

                    {/* Meta info block */}
                    <div className="space-y-3 flex-grow text-center sm:text-left">
                      <div>
                        <span className="text-[9px] font-mono text-stone-500 uppercase font-black block tracking-widest">
                          On-Air dial Broadcast:
                        </span>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none mt-1">
                          {activeRotationPlay?.title || "Slauson Renaissance"}
                        </h4>
                        <span className="text-[11px] font-bold text-[#D4AF37] font-mono block mt-1.5 uppercase">
                          Alias: {activeRotationPlay?.artist || "King Kendrick Jr."} • ({activeRotationPlay?.genre || "Soulful Boom-Bap"})
                        </span>
                      </div>

                      {/* Upvoting */}
                      <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 pt-1">
                        <button 
                          onClick={async () => {
                            if (!activeRotationPlay) return;
                            try {
                              const res = await fetch("/api/radio/upvote", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: activeRotationPlay.id })
                              });
                              const data = await res.json();
                              if (data.success) {
                                setRadioRotationList(prev => prev.map(s => s.id === activeRotationPlay.id ? { ...s, upvotes: s.upvotes + 1 } : s));
                                setActiveRotationPlay(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
                                setUserCoins(c => c + 3); // Reward user with 3 culture points!
                              }
                            } catch (e) {
                              console.error("Could not coordinate upvote on client:", e);
                            }
                          }}
                          className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-[#D4AF37] text-white rounded-lg text-xs font-mono font-bold uppercase transition flex items-center space-x-2 cursor-pointer"
                        >
                          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                          <span>UPVOTE AIR FREQUENCY ({activeRotationPlay?.upvotes || 0})</span>
                        </button>
                        <span className="text-[9px] font-mono text-stone-500">
                          Pays +3 points for quality auditing.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wave bar oscillator panel */}
                  <div className="mt-5 pt-4 border-t border-stone-900 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-stone-500 text-xs font-mono">
                      <Volume2 className="w-4 h-4 text-stone-400" />
                      <span className="text-[10px]">Track Rating Index: {activeRotationPlay?.reputation || 90}/118</span>
                    </div>
                    
                    <div className="flex space-x-1 flex-grow max-w-[200px] items-end h-6 justify-end pr-1 pointer-events-none select-none">
                      {[0.6, 0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.2, 0.85, 0.45, 0.75, 0.1, 0.95].map((val, idx) => (
                        <span 
                          key={idx} 
                          className="w-1 bg-[#D4AF37] rounded-sm animate-pulse" 
                          style={{ height: `${val * 100}%`, animationDelay: `${idx * 80}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submissions playlist timeline */}
                <div className="space-y-3.5">
                  <div className="flex justify-between border-b border-stone-900 pb-2">
                    <h5 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                      Rotation Deck Catalog Queue ({radioRotationList.length})
                    </h5>
                    <span className="text-[9px] font-mono text-stone-500 uppercase">Click track to queue</span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {radioRotationList.map((track) => {
                      const isCurrent = activeRotationPlay?.id === track.id;
                      return (
                        <div 
                          key={track.id}
                          onClick={() => {
                            setActiveRotationPlay(track);
                            setRadioSuccessCritique(null);
                          }}
                          className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer text-left ${isCurrent ? 'bg-stone-950 border-[#D4AF37]' : 'bg-stone-950/40 border-stone-900 hover:border-stone-850'}`}
                        >
                          <div className="space-y-1 truncate flex-grow">
                            <div className="flex items-center space-x-2">
                              <h5 className="text-xs font-bold text-white uppercase truncate">{track.title}</h5>
                              {isCurrent && (
                                <span className="px-1.5 py-0.25 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[7px] font-bold rounded uppercase">
                                  ON AIR
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-stone-400 block truncate">
                              {track.artist} • ({track.genre})
                            </span>
                          </div>
                          
                          <div className="text-[#D4AF37] font-mono text-[10px] bg-stone-900 border border-stone-800 px-2.5 py-1 rounded flex-shrink-0">
                            Rating Scale: {track.reputation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 3: ON-AIR PODCASTS LIST & LIVE STREAMS
            ========================================== */}
        {activeTab === "podcasts" && (
          <div className="space-y-8 text-left animate-fadeIn" id="podcasts-view">
            
            {/* Header */}
            <div className="border-b border-stone-900 pb-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                Anchor Platform Broadcast Console
              </span>
              <h3 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
                Podcasts & Shows Terminal
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Tune in to on-demand conversational drops and high-definition live video feeds streaming directly from the TPN Broadcaster studios.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left column: Video stream player card (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border-b border-stone-900 pb-2">
                  <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase flex items-center space-x-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-black" />
                    <span>Live Studio Video Camera</span>
                  </h4>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 relative overflow-hidden group">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-stone-900">
                    <img 
                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=80" 
                      alt="YouTube Stream" 
                      className="w-full h-full object-cover filter brightness-75 contrast-125 font-sans"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent flex flex-col justify-between p-4" />

                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 bg-red-600 text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded flex items-center space-x-1 shadow shadow-black/80 animate-pulse">
                        <span>LIVE NOW</span>
                      </span>
                      <span className="px-2 py-0.5 bg-stone-950/80 border border-stone-800 backdrop-blur text-[8px] font-mono tracking-widest text-[#D4AF37] rounded">
                        TPN BROADCAST FEED
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => alert("Connecting direct live webcast session... Automatically syncing streams audio. Open on a dedicated tab to test direct RTMP sources.")}
                        className="p-5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition hover:scale-105 active:scale-95 duration-250 cursor-pointer flex items-center justify-center animate-pulse"
                      >
                        <Youtube className="w-8 h-8 text-white fill-white" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider block">Webcast Stream Target:</span>
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight line-clamp-1">
                        TPN CH-45 BLOCK TIME HOUR: EXCLUSIVE MIX & INTRODUCTIONS
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#121111] rounded-2xl border border-stone-900 text-left space-y-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wide block font-black">Studio Note:</span>
                  <p className="text-stone-400 text-xs leading-relaxed font-light font-sans">
                    Our live broadcaster studio syncs multi-camera operations into streaming servers so viewers on other networks can join. Connect to watch live debates!
                  </p>
                </div>
              </div>

              {/* Right column: AudioPlayerSection (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-stone-900 pb-2">
                  <h4 className="text-xs font-mono font-bold text-stone-400 uppercase">
                    On-Demand Episode Catalog
                  </h4>
                </div>
                {/* Embedded React AudioPlayer component */}
                <AudioPlayerSection episodes={podcastEpisodes} />
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 4: BUSINESS HUSTLE GENERATOR
            ========================================== */}
        {activeTab === "hustle" && (
          <div className="space-y-8 text-left animate-fadeIn" id="hustle-view">
            
            {/* Header */}
            <div className="border-b border-stone-900 pb-4">
              <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                <span>The Startup Plan Generator</span>
              </span>
              <h3 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
                Business Hustle Router
              </h3>
              <p className="text-xs text-stone-400 mt-2 max-w-2xl leading-relaxed">
                Formulate full-scale commercial strategies, required block licensing structures, investor pitch outlines, and marketing campaigns to jumpstart any side-hustle venture instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Creator inputs frame (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850 space-y-5">
                  <h4 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold border-b border-stone-900 pb-2">
                    Hustle Design Fields
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-mono font-bold uppercase block tracking-wider">Hustle Core Concept Idea *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Street Barber Pop-up, Custom Sneaker Detailer"
                        value={hustleIdea}
                        onChange={(e) => setHustleIdea(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-mono font-bold uppercase block tracking-wider">Startup Budget *</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. $500, $2000"
                          value={hustleBudget}
                          onChange={(e) => setHustleBudget(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-400 font-mono font-bold uppercase block tracking-wider">Target Neighborhood *</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Slauson Ave, Brooklyn"
                          value={hustleLocation}
                          onChange={(e) => setHustleLocation(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-850 p-2.5 text-xs text-stone-200 rounded outline-none placeholder:text-stone-700"
                        />
                      </div>
                    </div>

                    {hustleError && (
                      <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-200 text-xs rounded select-none">
                        {hustleError}
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        if (!hustleIdea || !hustleBudget || !hustleLocation) {
                          setHustleError("Concept Idea, Starting Budget and Neighborhood Block inputs are all required!");
                          return;
                        }
                        setIsHustling(true);
                        setHustleError(null);
                        setHustleResult(null);

                        try {
                          const res = await fetch("/api/hustle/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              idea: hustleIdea,
                              budget: hustleBudget,
                              location: hustleLocation
                            })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);

                          setHustleResult(data);
                        } catch (err: any) {
                          setHustleError(err.message || "Could not generate business playbook.");
                        } finally {
                          setIsHustling(false);
                        }
                      }}
                      disabled={isHustling}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#ebd074] disabled:bg-stone-900 disabled:text-stone-600 text-stone-950 rounded-xl text-xs font-mono font-bold tracking-widest transition-colors cursor-pointer flex items-center justify-center space-x-2 uppercase"
                    >
                      {isHustling ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full" />
                          <span>formulating start plans...</span>
                        </>
                      ) : (
                        <span>Generate Business Playbook</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl border border-stone-850">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold leading-none">Inspiration Suggest:</span>
                  <p className="text-stone-400 text-xs mt-1.5 leading-relaxed font-sans font-light">
                    Try typing <strong>&apos;Gourmet Southern Food Truck&apos;</strong> with budget <strong>$1500</strong> under location <strong>Crenshaw Block</strong>!
                  </p>
                </div>
              </div>

              {/* Outputs panel (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {isHustling ? (
                  <div className="w-full bg-[#121111] border border-stone-850 p-12 rounded-3xl flex flex-col justify-center items-center space-y-3">
                    <span className="animate-spin inline-block w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
                    <h4 className="text-xs font-mono uppercase tracking-widest text-stone-300 animate-pulse mt-2">DETERMINING BLOCK SUITABILITY INDEXERS</h4>
                    <p className="text-[10px] font-mono text-stone-500">FORMATTING STRATEGY BLUEPRINT SLIDES...</p>
                  </div>
                ) : hustleResult ? (
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-3xl space-y-5 text-left animate-fadeIn">
                    <div className="flex justify-between items-start text-[10px] font-mono border-b border-stone-900 pb-3">
                      <div>
                        <span className="text-emerald-400 font-bold block">● STARTUP BLUEPRINT SYSTEM CREATED</span>
                        <h4 className="text-lg font-black text-white uppercase mt-1 leading-none">{hustleResult.businessName}</h4>
                      </div>
                      <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 border border-[#D4AF37]/35 rounded-md text-[10px] font-black uppercase tracking-widest flex-shrink-0">
                        VIABILITY SCORE: {hustleResult.formulaScore}/100
                      </span>
                    </div>

                    {/* Progress tracking line */}
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Viability suitability score:</span>
                      <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden mt-1.5 border border-stone-850">
                        <div 
                          className="bg-[#D4AF37] h-full rounded-full" 
                          style={{ width: `${hustleResult.formulaScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 font-sans text-xs text-stone-300">
                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Execution Plan:</span>
                        <p className="leading-relaxed mt-1 text-stone-200">{hustleResult.businessPlan}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#121111] border border-stone-900 rounded-xl space-y-1.5">
                          <span className="text-[#D4AF37] font-mono text-[9px] font-bold uppercase tracking-wider block">Startup Steps Checklist:</span>
                          <ul className="list-disc pl-3 text-[11px] text-stone-400 space-y-1">
                            {hustleResult.startupChecklist.map((c: string, i: number) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                        <div className="p-3 bg-[#121111] border border-stone-900 rounded-xl space-y-1.5">
                          <span className="text-[#D4AF37] font-mono text-[9px] font-bold uppercase tracking-wider block">Required Block Licenses / Permits:</span>
                          <ul className="list-disc pl-3 text-[11px] text-stone-400 space-y-1">
                            {hustleResult.localPermits.map((p: string, i: number) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Presentation deck slide guidelines */}
                      <div className="space-y-2">
                        <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider block font-bold">5-Part Investor Presentation Outline</span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                          {hustleResult.pitchDeck.map((slide: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-stone-900 border border-stone-850 rounded-lg text-left">
                              <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-widest block">SLIDE {idx+1}</span>
                              <span className="text-[10px] text-white block font-bold line-clamp-1 mt-0.5">{slide.slide}</span>
                              <p className="text-[8px] text-stone-400 mt-1 line-clamp-2 leading-tight font-sans">{slide.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase block font-bold">Digital Rollout Campaign:</span>
                        <p className="leading-relaxed mt-1 text-stone-300 font-mono text-[11px]">{hustleResult.launchStrategy}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-[#121111]/40 border border-dashed border-stone-900 p-8 rounded-3xl flex flex-col justify-center items-center space-y-4 text-center text-stone-600">
                    <Briefcase className="w-10 h-10 text-stone-800" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold">GENERATOR DESK IDLE</h4>
                      <p className="text-xs max-w-sm mt-1 leading-normal text-stone-500">
                        Input concept parameters, starting budget allocation, and the desired block destination above, then click <strong>Generate Business Playbook</strong> to compile AI templates.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 5: THE SPORTSBOOK PREDICTION BOARD
            ========================================== */}
        {activeTab === "sportsbook" && (
          <div className="space-y-8 text-left animate-fadeIn" id="sportsbook-view">
            
            {/* Header */}
            <div className="border-b border-stone-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono tracking-widest text-orange-600 uppercase font-bold flex items-center space-x-1.5 animate-pulse">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>The Oracle • AI Predictive Calculator</span>
                </span>
                <h3 className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
                  Sports Predictions & Game Picks
                </h3>
                <p className="text-xs text-stone-400 mt-2 max-w-2xl leading-relaxed">
                  Break down team lineups, home-field weather parameters, player injuries and locker room chemistry. Select a live match or click Underdog Pick of the Day!
                </p>
              </div>

              <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 flex items-center space-x-3 shadow-lg font-mono flex-shrink-0">
                <Coins className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[9px] text-[#D4AF37] uppercase block font-black">Culture points</span>
                  <span className="text-sm font-bold text-white">{userCoins} Points</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main inputs section (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Simulated Game Lines Widget Card */}
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-900 pb-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                      Live Betting Game Lines
                    </span>
                    <button 
                      onClick={syncLiveOdds}
                      disabled={isOddsSyncing}
                      className="text-[9px] font-mono uppercase bg-stone-900 hover:bg-stone-850 px-2 py-0.5 border border-stone-800 rounded font-bold text-stone-400 disabled:text-stone-700"
                    >
                      {isOddsSyncing ? "Syncing..." : "🔄 Sync Lines"}
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-500 font-mono">
                    Click any ongoing line below to load details into the analyzer desk instantly:
                  </p>

                  <div className="space-y-2">
                    {liveOddsGames.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setSportsLineup(`${game.awayTeam} at ${game.homeTeam} (${game.awayOdds} / ${game.homeOdds}) - ${game.sport}`)}
                        className="w-full text-left p-3 bg-stone-900/50 border border-stone-850 hover:border-stone-700 rounded-xl transition duration-150 block truncate font-mono text-[11px] hover:bg-stone-900"
                      >
                        <div className="flex justify-between text-stone-500 text-[8px] mb-1">
                          <span>{game.sport}</span>
                          <span>{game.commenceTime}</span>
                        </div>
                        <div className="flex justify-between items-center text-stone-200">
                          <span className="font-bold">{game.awayTeam} vs {game.homeTeam}</span>
                          <span className="text-[#D4AF37] font-black">{game.awayOdds} / {game.homeOdds}</span>
                        </div>
                        <span className="text-[7.5px] text-stone-600 block text-right mt-1.5 font-sans">Provider: {game.source}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850 space-y-4">
                  <h4 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold border-b border-stone-900 pb-2">
                    Predictor Board Desk
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 font-mono font-bold uppercase block tracking-wider">Betting Slip Or Matchup Line *</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="e.g. Lakers (-110) vs Celtics (+110) matchups lines. Star player is recovering from a mild ankle strain, but locker room motivation is high..."
                        value={sportsLineup}
                        onChange={(e) => setSportsLineup(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-3 text-xs text-stone-200 rounded-xl outline-none placeholder:text-stone-700"
                      />
                    </div>

                    {sportsError && (
                      <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-200 text-xs rounded select-none">
                        {sportsError}
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        if (!sportsLineup) {
                          setSportsError("Please select an active line above or enter custom matchup details!");
                          return;
                        }
                        setIsPredicting(true);
                        setSportsError(null);
                        setPredictionResult(null);

                        try {
                          const res = await fetch("/api/sports/predict", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ lineupOrSlip: sportsLineup })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);

                          setPredictionResult(data);
                        } catch (err: any) {
                          setSportsError(err.message || "Could not analyze predictor variables.");
                        } finally {
                          setIsPredicting(false);
                        }
                      }}
                      disabled={isPredicting}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-stone-900 disabled:to-stone-950 disabled:text-stone-600 text-white rounded-xl text-xs font-mono font-bold tracking-widest transition cursor-pointer flex items-center justify-center space-x-2 uppercase"
                    >
                      {isPredicting ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>running matchups calculations...</span>
                        </>
                      ) : (
                        <span>Evaluate Slip / Matchup</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Pick of the day burner bet block */}
                <div className="bg-[#121111] p-5 rounded-2xl border border-stone-850 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-orange-500 font-bold uppercase tracking-widest">
                      RECOMMENDED UNDERDOG VECTOR
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-950/30 border border-red-900 text-red-400 font-mono text-[8px] font-bold rounded animate-pulse">
                      HIGH PAYOUT
                    </span>
                  </div>

                  <div>
                    <h5 className="text-md font-bold text-stone-200 uppercase leading-none">
                      Underdog Pick of the Day
                    </h5>
                    <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                      Extract high-yield upset possibilities dynamically vetted by the analytical model. Get the underdog picks and breakdown details.
                    </p>
                  </div>

                  {burnerBet ? (
                    <div className="p-4 bg-stone-950 rounded-xl space-y-3 text-xs font-mono text-stone-200 animate-fadeIn border border-orange-600/20 text-left">
                      <div className="flex justify-between items-center text-[10px] border-b border-stone-900 pb-1.5">
                        <span className="font-bold text-orange-500">{burnerBet.gameTitle}</span>
                        <span className="bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded text-[8px]">{burnerBet.riskRating}</span>
                      </div>
                      <div className="flex justify-between text-[#D4AF37] font-bold">
                        <span>PICK: {burnerBet.underdogTeam}</span>
                        <span>Odds: {burnerBet.payoutOdds}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[8px] uppercase tracking-wider block font-black">AI Breakdown & Context:</span>
                        <p className="text-stone-300 font-sans text-xs mt-1 leading-relaxed font-light">{burnerBet.alchemicalExplanation}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsIgnitingBurner(true);
                        try {
                          const res = await fetch("/api/sports/burner-bet", { method: "POST" });
                          const data = await res.json();
                          setBurnerBet(data);
                        } catch (e) {
                          console.error("Could not run underdog spotter:", e);
                        } finally {
                          setIsIgnitingBurner(false);
                        }
                      }}
                      disabled={isIgnitingBurner}
                      className="w-full py-2 bg-gradient-to-r from-stone-900 to-stone-950 hover:bg-[#121111] text-orange-500 border border-stone-850 hover:border-orange-500 rounded-xl font-mono text-[10px] font-semibold text-center transition cursor-pointer"
                    >
                      {isIgnitingBurner ? "DETERMINING BEST MATCHUPS SELECTION..." : "Get Today's Underdog Pick of the Day"}
                    </button>
                  )}
                </div>

              </div>

              {/* Outputs panel display (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {isPredicting ? (
                  <div className="w-full bg-[#121111] border border-stone-850 p-12 rounded-3xl flex flex-col justify-center items-center space-y-3">
                    <span className="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
                    <h4 className="text-xs font-mono uppercase tracking-widest text-stone-300 animate-pulse mt-2">DETERMINING LINE SUITABILITIES</h4>
                    <p className="text-[10px] font-mono text-orange-500">RETRIEVING INJURIES & SOCIAL OPINION SURVEYS...</p>
                  </div>
                ) : predictionResult ? (
                  <div className="bg-stone-950 border border-stone-850 p-6 rounded-3xl space-y-5 text-left animate-fadeIn">
                    
                    <div className="flex justify-between items-start text-[10px] font-mono border-b border-stone-900 pb-3">
                      <div>
                        <span className="text-emerald-400 font-bold block">● MATCHUP ANALYSIS COMPLETE</span>
                        <span className="text-stone-500 text-[8px] block">Confidence prediction formulas solved</span>
                      </div>
                      <span className="bg-orange-500/10 text-orange-400 px-3 py-1 border border-orange-500/20 rounded-md text-[10px] font-black uppercase tracking-widest flex-shrink-0">
                        {predictionResult.confidenceScore}% CONFIDENCE
                      </span>
                    </div>

                    {/* Progress score block */}
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase block font-bold">Confidence percentage:</span>
                      <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden mt-1.5 border border-stone-850">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" 
                          style={{ width: `${predictionResult.confidenceScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 bg-stone-900/50 border border-stone-900 rounded-xl">
                        <span className="text-[#D4AF37] text-[9px] font-black uppercase block">Combustion Risk Level:</span>
                        <p className="text-stone-300 font-sans text-xs mt-1 leading-normal font-light">{predictionResult.riskAssessment}</p>
                      </div>
                      <div className="p-3 bg-stone-900/50 border border-stone-900 rounded-xl">
                        <span className="text-[#D4AF37] text-[9px] font-black uppercase block font-bold">Weather Constant Impact:</span>
                        <p className="text-stone-300 font-sans text-xs mt-1 leading-normal font-light">{predictionResult.weatherImpact}</p>
                      </div>
                    </div>

                    <div className="space-y-4 font-sans text-stone-300 text-xs">
                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Roster & Injury reports:</span>
                        <p className="mt-1 leading-relaxed font-light">{predictionResult.injuryReport}</p>
                      </div>

                      <div>
                        <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider block font-bold">Social sentiment & Locker vibe:</span>
                        <p className="mt-1 leading-relaxed font-light">{predictionResult.socialSentiment}</p>
                      </div>

                      <div className="p-4 bg-stone-900 border border-[#D4AF37]/20 rounded-2xl text-[#D4AF37]">
                        <span className="text-[9px] font-mono uppercase tracking-widest block font-black">
                          ★ ANALYTICAL PICK VERDICT:
                        </span>
                        <p className="font-mono text-sm leading-relaxed mt-1.5 font-bold">
                          {predictionResult.pureGoldVerdict}
                        </p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="w-full bg-[#121111]/40 border border-dashed border-stone-900 p-8 rounded-3xl flex flex-col justify-center items-center space-y-4 text-center text-stone-600">
                    <Flame className="w-10 h-10 text-stone-800" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold">ANALYZER DESK IDLE</h4>
                      <p className="text-xs max-w-sm mt-1.5 leading-normal text-stone-500 font-sans font-light">
                        Select a modern live game line from the list above or input standard bet structures, then click <strong>Evaluate Slip</strong> to calculate outcomes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Coin guessing predictor games */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-2">
                    <h5 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                      Interactive Prediction Slips
                    </h5>
                    <span className="text-[9px] font-mono text-stone-500 uppercase">WIN PAYS +10 COINS</span>
                  </div>

                  <div className="space-y-3">
                    {predictionHistory.map((slip) => (
                      <div key={slip.id} className="p-3.5 bg-stone-950 border border-stone-900 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-mono text-left">
                        <div className="space-y-1">
                          <span className="text-stone-500 text-[8px] block">MATCHUP DUEL</span>
                          <span className="text-stone-300 font-sans font-bold text-xs block uppercase">{slip.selection}</span>
                        </div>

                        {slip.resolved ? (
                          <div className="flex items-center space-x-3 text-[11px] font-bold select-none">
                            <span className="text-stone-500">SELECTION: {slip.userGuess.toUpperCase()}</span>
                            <span className="text-emerald-400 font-mono">{slip.outcome}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-stone-500 text-[9px] uppercase font-bold mr-1">VOTE GUESS:</span>
                            <button
                              onClick={() => {
                                if (userCoins < 2) return;
                                setUserCoins(c => c - 2);
                                setPredictionHistory(prev => prev.map(s => s.id === slip.id ? {
                                  ...s,
                                  resolved: true,
                                  correct: true,
                                  userGuess: "win",
                                  outcome: "WIN (Hit! +10 Coins awarded)"
                                } : s));
                                setUserCoins(c => c + 10);
                              }}
                              className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#ebd074] text-stone-950 font-black rounded uppercase text-[10px]"
                            >
                              WIN (-2)
                            </button>
                            <button
                              onClick={() => {
                                if (userCoins < 2) return;
                                setUserCoins(c => c - 2);
                                setPredictionHistory(prev => prev.map(s => s.id === slip.id ? {
                                  ...s,
                                  resolved: true,
                                  correct: false,
                                  userGuess: "loss",
                                  outcome: "LOSS (Misfire! Predictor expired)"
                                } : s));
                              }}
                              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-850 border border-stone-850 text-stone-300 font-black rounded uppercase text-[10px]"
                            >
                              LOSS (-2)
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}

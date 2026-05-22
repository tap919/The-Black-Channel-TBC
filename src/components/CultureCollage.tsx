import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Tv, 
  Music, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Maximize2, 
  Grid,
  Video,
  Image as ImageIcon,
  Check,
  Flame,
  Info,
  Radio,
  Sliders,
  Move
} from "lucide-react";

// Predefined atmospheric sound loops for our Ambient Street Soundboard.
// Using reliable and light royalty-free WAV loops as safe soundboard ingredients.
const AMBIENT_TRACKS = [
  { id: "rain", label: "Slauson Rain", url: "https://assets.mixkit.co/active_storage/sfx/1657/1657-84.wav" },
  { id: "vinyl", label: "Vinyl Static Crackle", url: "https://assets.mixkit.co/active_storage/sfx/2237/2237-84.wav" },
  { id: "basketball", label: "Rucker Basketball Bounce", url: "https://assets.mixkit.co/active_storage/sfx/1012/1012-84.wav" },
  { id: "drone", label: "Late-Night Sub 808 Drone", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav" }
];

interface CollageItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string;
  frameStyle: "polaroid" | "cctv" | "poster" | "negative";
  tapeColor: "gold" | "orange" | "yellow" | "black";
  rotation: string; // Tailwind rotate classes
  markerText: string;
  size: "small" | "medium" | "large";
}

const INITIAL_COLLAGE_ITEMS: CollageItem[] = [
  {
    id: "item-1",
    type: "video",
    url: "https://player.vimeo.com/external/324147775.sd.mp4?s=d0f01a3577d337d3513fac320ad8346ae48bc6a9&profile_id=164&oauth2_token_id=57447761",
    caption: "Act II: Extracting physical soul samples from dusty local crates. 78 RPM groove.",
    frameStyle: "polaroid",
    tapeColor: "gold",
    rotation: "rotate-2",
    markerText: "Au79 Certified",
    size: "medium"
  },
  {
    id: "item-2",
    type: "video",
    url: "https://player.vimeo.com/external/517602126.sd.mp4?s=f5e9da8fe05d33454b830d9fbda9ae7a5e42bf6e&profile_id=164&oauth2_token_id=57447761",
    caption: "Hs Substation: Streetball asphalt courts & dusk lighting constants.",
    frameStyle: "cctv",
    tapeColor: "orange",
    rotation: "-rotate-2",
    markerText: "Active Furnace [● REC]",
    size: "large"
  },
  {
    id: "item-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60",
    caption: "Slauson Avenue. Liquid atmospheric neon gradient on cold wet slate.",
    frameStyle: "poster",
    tapeColor: "yellow",
    rotation: "rotate-3",
    markerText: "Refined Compound No. 4",
    size: "medium"
  },
  {
    id: "item-4",
    type: "video",
    url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339d3c117897b914a2f8c5b967&profile_id=139&oauth2_token_id=57447761",
    caption: "VOX 1. Magnetic tape oxide reaction logs. Vintage telemetry tapes.",
    frameStyle: "negative",
    tapeColor: "black",
    rotation: "-rotate-3",
    markerText: "Collector's Archive",
    size: "medium"
  },
  {
    id: "item-5",
    type: "image",
    url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=60",
    caption: "Au79 Mold Core. Custom mold detailing. Melt point index 1064°C.",
    frameStyle: "polaroid",
    tapeColor: "gold",
    rotation: "rotate-1",
    markerText: "Gold Standard Weight",
    size: "small"
  },
  {
    id: "item-6",
    type: "image",
    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60",
    caption: "Guerilla Silk drop specs. 450GSM heavy pre-shrunk brushed fleece.",
    frameStyle: "poster",
    tapeColor: "black",
    rotation: "-rotate-1",
    markerText: "Street Rating: 100/100",
    size: "medium"
  }
];

export default function CultureCollage({ onNavigate }: { onNavigate?: (tab: "canvas" | "lab" | "periodic" | "reviews" | "marketplace" | "residue" | "tools") => void }) {
  const [items, setItems] = useState<CollageItem[]>(INITIAL_COLLAGE_ITEMS);
  const [activeTab, setActiveTab] = useState<"wall" | "cctv" | "soundboard">("wall");
  
  // Interactive Custom Artifact addition form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newFrameStyle, setNewFrameStyle] = useState<"polaroid" | "cctv" | "poster" | "negative">("polaroid");
  const [newTapeColor, setNewTapeColor] = useState<"gold" | "orange" | "yellow" | "black">("gold");
  const [newMarker, setNewMarker] = useState("Custom Alloy");
  const [newSize, setNewSize] = useState<"small" | "medium" | "large">("medium");

  // Filter category
  const [filterStyle, setFilterStyle] = useState<string | null>(null);

  // Sound board toggle status states
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  const [soundVolumes, setSoundVolumes] = useState<Record<string, number>>({
    rain: 60,
    vinyl: 70,
    basketball: 50,
    drone: 40
  });

  // Audio object refs to persist playback nodes on soundboard
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // CCTV Monitor controls
  const [cctvActiveChannel, setCctvActiveChannel] = useState(0);
  const [showScanlines, setShowScanlines] = useState(true);
  const [cctvMuted, setCctvMuted] = useState(true);

  // Initialize background elements
  useEffect(() => {
    // Cleanup audios on unmount
    return () => {
      Object.values(audioRefs.current).forEach((aud: any) => {
        if (aud && typeof aud.pause === "function") {
          aud.pause();
        }
      });
    };
  }, []);

  // Handler to toggle an ambient track
  const toggleAmbientSound = (trackId: string, url: string) => {
    const isPlaying = activeSounds[trackId];
    
    if (isPlaying) {
      if (audioRefs.current[trackId]) {
        audioRefs.current[trackId].pause();
      }
      setActiveSounds((prev) => ({ ...prev, [trackId]: false }));
    } else {
      // Create element if not existing
      if (!audioRefs.current[trackId]) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = (soundVolumes[trackId] ?? 50) / 100;
        audioRefs.current[trackId] = audio;
      }
      
      audioRefs.current[trackId].volume = (soundVolumes[trackId] ?? 50) / 100;
      audioRefs.current[trackId].play().catch((err) => {
        console.warn("Audio play blocked by browser policy:", err);
      });
      setActiveSounds((prev) => ({ ...prev, [trackId]: true }));
    }
  };

  // Hander for slider volume adjustment
  const handleVolumeSliderChange = (trackId: string, val: number) => {
    setSoundVolumes((prev) => ({ ...prev, [trackId]: val }));
    if (audioRefs.current[trackId]) {
      audioRefs.current[trackId].volume = val / 100;
    }
  };

  // Add custom asset to interactive collage list
  const handleAddArtifact = (e: FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    // Pick a random rotation class as a playful default
    const rotatePresets = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-3", "-rotate-3"];
    const randomRotate = rotatePresets[Math.floor(Math.random() * rotatePresets.length)];

    const newItem: CollageItem = {
      id: `custom-${Date.now()}`,
      type: newType,
      url: newUrl,
      caption: newCaption || "A custom base element added to our cultural archive block.",
      frameStyle: newFrameStyle,
      tapeColor: newTapeColor,
      rotation: randomRotate,
      markerText: newMarker || "Custom Material",
      size: newSize
    };

    setItems([newItem, ...items]);
    
    // Reset form
    setNewUrl("");
    setNewCaption("");
    setNewMarker("Custom Alloy");
    setShowAddForm(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Video feeds specifically isolated for the CRT monitoring station
  const videoFeeds = items.filter(i => i.type === "video");

  return (
    <div className="space-y-8 text-left" id="culture-collage-component">
      
      {/* Dynamic Gritty Entry Ports Directory (User requested links to various departments) */}
      <div className="bg-[#121111] p-5 rounded-2xl border border-stone-850 relative overflow-hidden shadow-2xl" id="canvas-street-directory">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/15 via-amber-900/10 to-blue-900/15 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-900 pb-3.5 mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold block leading-none">
              STREET CENTRAL ROUTING CONSOLE
            </span>
            <h4 className="text-xl font-graffiti text-pink-500 uppercase tracking-wide mt-1.5 leading-none">
              SITE DEPARTMENTS DIRECTORY
            </h4>
          </div>
          <span className="text-[9px] font-mono text-zinc-400 uppercase px-2.5 py-1 bg-stone-950 rounded border border-stone-850 select-none">
            Status: Live Feed Synced • Click Port to Navigate
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 relative">
          {[
            { tag: "01", name: "Radio / Podcasts Hub", desc: "OBS Stream & Media Airwaves", tab: "lab" as const, color: "text-amber-400 border-amber-500/20 hover:border-amber-400 bg-amber-950/15 hover:bg-amber-950/30" },
            { tag: "02", name: "Category Navigator", desc: "Simplified Theme Matrix", tab: "periodic" as const, color: "text-sky-400 border-sky-500/20 hover:border-sky-400 bg-sky-950/15 hover:bg-sky-950/30" },
            { tag: "03", name: "Album Assessments", desc: "Raw Rap Critiques & Reviews", tab: "reviews" as const, color: "text-red-400 border-red-500/20 hover:border-red-400 bg-red-950/15 hover:bg-red-950/30" },
            { tag: "04", name: "Producer Beat Store", desc: "Free DLs & Exclusive Offers", tab: "marketplace" as const, color: "text-[#D4AF37] border-amber-500/20 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40" },
            { tag: "05", name: "Creator OS Tools", desc: "Link, Unlink & Export Repos", tab: "tools" as const, color: "text-purple-400 border-purple-500/20 hover:border-purple-400 bg-purple-950/15 hover:bg-purple-950/30" },
            { tag: "06", name: "Voicemail & Hustles", desc: "Listener Tapes & Local Ads", tab: "residue" as const, color: "text-emerald-400 border-emerald-500/20 hover:border-emerald-400 bg-emerald-950/15 hover:bg-emerald-950/30" },
          ].map((port) => (
            <button
              key={port.tag}
              onClick={() => onNavigate?.(port.tab)}
              className={`p-3.5 rounded-xl border text-left transition-all hover:scale-[1.03] hover:shadow-lg active:scale-95 duration-200 cursor-pointer flex flex-col justify-between h-[105px] ${port.color}`}
            >
              <div className="flex items-center justify-between font-mono text-[8px] mb-1 opacity-70 w-full">
                <span>PORT {port.tag}</span>
                <span className="text-[7px] tracking-wider font-bold">» DIRECT</span>
              </div>
              <div>
                <h5 className="text-[10.5px] font-bold leading-tight uppercase font-stencil text-neutral-100">
                  {port.name}
                </h5>
                <p className="text-[8.5px] text-zinc-400 font-light mt-1 leading-tight line-clamp-2">
                  {port.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Intro statement with styled collage zine tag */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-stone-900 pb-5 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-black tracking-[0.25em] text-[#D4AF37] uppercase flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>EXHIBIT CANOPY AREA</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
            THE ALCHEMICAL <span className="text-[#D4AF37]">CANVAS</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            A visual, living, scrap-book of the culture. Mix your own soundscapes, cycle through live streaming CCTV studio feeds, or pin your own visual compounds to the street board.
          </p>
        </div>

        {/* Collage Submenu Navigation */}
        <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-850" id="collage-sub-nav">
          <button 
            onClick={() => setActiveTab("wall")}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === "wall" ? "bg-[#D4AF37] text-stone-950 font-bold" : "text-stone-400 hover:text-white"}`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>The Wall</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("cctv")}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === "cctv" ? "bg-[#D4AF37] text-stone-950 font-bold" : "text-stone-400 hover:text-white"}`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>CCTV Monitor Feeds</span>
          </button>

          <button 
            onClick={() => setActiveTab("soundboard")}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === "soundboard" ? "bg-[#D4AF37] text-stone-950 font-bold" : "text-stone-400 hover:text-white"}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ambient Mixer</span>
          </button>
        </div>
      </div>

      {/* FILTER CHIPS (ONLY FOR WALL MODE) */}
      {activeTab === "wall" && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/40 p-3 rounded-2xl border border-stone-850" id="wall-filter-bar">
          <div className="flex flex-wrap items-center gap-1.5" id="filter-selection">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-bold mr-1">FRAME FILTER:</span>
            <button 
              onClick={() => setFilterStyle(null)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition ${filterStyle === null ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40" : "bg-stone-900 text-stone-400 border border-transparent hover:text-white"}`}
            >
              All Formats ({items.length})
            </button>
            <button 
              onClick={() => setFilterStyle("polaroid")}
              className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition ${filterStyle === "polaroid" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40" : "bg-stone-900 text-stone-400 border border-transparent hover:text-white"}`}
            >
              Polaroid Deck
            </button>
            <button 
              onClick={() => setFilterStyle("poster")}
              className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition ${filterStyle === "poster" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40" : "bg-stone-900 text-stone-400 border border-transparent hover:text-white"}`}
            >
              Studio Posters
            </button>
            <button 
              onClick={() => setFilterStyle("cctv")}
              className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition ${filterStyle === "cctv" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40" : "bg-stone-900 text-stone-400 border border-transparent hover:text-white"}`}
            >
              CCTV Feeds
            </button>
            <button 
              onClick={() => setFilterStyle("negative")}
              className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition ${filterStyle === "negative" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40" : "bg-stone-900 text-stone-400 border border-transparent hover:text-white"}`}
            >
              Analog Negatives
            </button>
          </div>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-amber-400 text-stone-950 font-bold font-mono text-[11px] rounded-lg tracking-wider flex items-center space-x-1 cursor-pointer transition-all"
            id="trigger-artifact-form"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>PIN ART ALCHEMIC</span>
          </button>
        </div>
      )}

      {/* RENDER VIEW 1: THE COLLAGE WALL CONTAINER */}
      {activeTab === "wall" && (
        <div className="relative space-y-6" id="wall-workspace">
          
          {/* USER ADD ARTIFACT POPUP DIALOG */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-stone-950 border-2 border-[#D4AF37] p-6 rounded-2xl max-w-2xl w-full mx-auto text-left relative z-40 shadow-2xl shadow-yellow-950/20"
                id="add-artifact-popover"
              >
                <div className="flex items-center justify-between border-b border-stone-900 pb-3 mb-4">
                  <h4 className="text-sm font-mono tracking-widest text-[#D4AF37] font-black uppercase flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>PIN NEW MEMORY ARTIFACT</span>
                  </h4>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-stone-500 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <form onSubmit={handleAddArtifact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Media Type */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Medium Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setNewType("image")}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border cursor-pointer flex items-center justify-center space-x-1 ${newType === "image" ? "bg-white text-stone-950 font-bold border-white" : "bg-stone-900 text-stone-400 border-transparent hover:text-stone-200"}`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Image URL</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setNewType("video")}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border cursor-pointer flex items-center justify-center space-x-1 ${newType === "video" ? "bg-white text-stone-950 font-bold border-white" : "bg-stone-900 text-stone-400 border-transparent hover:text-stone-200"}`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Short Video URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Frame style */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Canvas Frame Preset</label>
                      <select
                        value={newFrameStyle}
                        onChange={(e) => setNewFrameStyle(e.target.value as any)}
                        className="w-full bg-stone-900 border border-stone-800 p-2 text-xs text-stone-200 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="polaroid">Polaroid Slide Frame</option>
                        <option value="poster">Studio Poster Tape Outline</option>
                        <option value="cctv">CRT CCTV Screen Filter</option>
                        <option value="negative">Analog Film Negative Sprocket</option>
                      </select>
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-1 font-bold">
                      Source Link Address URL
                    </label>
                    <input 
                      type="url"
                      required
                      placeholder={newType === "image" 
                        ? "Paste any image URL (Unsplash, Picsum, etc.)" 
                        : "Paste any looping MP4 URL (Vimeo external CDN loop, Pexels direct, etc.)"
                      }
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-[#D4AF37]/50 p-2.5 text-xs text-stone-100 rounded-xl outline-none font-mono"
                    />
                    <p className="text-[9px] font-mono text-stone-500 mt-1">
                      Fallback placeholder will be applied if URL is vacant.
                    </p>
                  </div>

                  {/* Caption & Custom Marker text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Handwritten Annotation Label</label>
                      <input 
                        type="text"
                        placeholder="e.g., Active gold mold specs."
                        value={newMarker}
                        onChange={(e) => setNewMarker(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 p-2 text-xs text-stone-200 rounded-lg outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Adhesive Ribbon Color</label>
                      <select
                        value={newTapeColor}
                        onChange={(e) => setNewTapeColor(e.target.value as any)}
                        className="w-full bg-stone-900 border border-stone-800 p-2 text-xs text-stone-200 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="gold">Pure Metallic Gold Leaf</option>
                        <option value="orange">Industrial Orange Warning Tape</option>
                        <option value="yellow">Hazard Caution Yellow Tape</option>
                        <option value="black">Asphalt Matte Black Gaffer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Art Description Caption</label>
                    <textarea 
                      placeholder="Write a brief poetic alchemical note directly underneath..."
                      rows={2}
                      maxLength={180}
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-200 rounded-xl outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Canvas Grid Weight (Size)</label>
                      <select 
                        value={newSize} 
                        onChange={(e) => setNewSize(e.target.value as any)}
                        className="w-full bg-stone-900 border border-stone-800 p-2 text-xs text-stone-200 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="small">Small (compact alloy)</option>
                        <option value="medium">Medium (standard size)</option>
                        <option value="large">Large (wide poster grid)</option>
                      </select>
                    </div>
                    
                    <div className="text-right pt-4">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-stone-950 font-black font-mono text-xs uppercase tracking-widest rounded-xl hover:from-amber-400 hover:to-yellow-500 transition-all cursor-pointer shadow-lg shadow-amber-950/20"
                      >
                        CAST VISUAL ALLOY
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PHYSICAL SCRAPBOOK MOOD BOARD SECTION */}
          <div className="p-4 bg-stone-950/20 rounded-3xl border border-stone-900/60 relative overflow-hidden" id="collage-mood-canvas">
            
            {/* Visual elements: grid instructions */}
            <div className="absolute top-3 right-4 z-20 flex items-center space-x-1.5 text-[10px] font-mono text-stone-600 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-900 select-none">
              <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>DRAG ANY DISK TO SHUFFLE</span>
            </div>

            {/* ASYMMETRICAL MULTI-FLOW COLLAGE ART-GRID */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 pt-10" 
              id="asymmetric-scrapbook-field"
            >
              {items
                .filter((item) => filterStyle === null || item.frameStyle === filterStyle)
                .map((item) => {
                  
                  // Adhesive tape aesthetic styles
                  const tapeColorClasses = {
                    gold: "bg-gradient-to-r from-[#D4AF37]/80 to-amber-500/80 shadow-[0_1px_5px_rgba(212,175,55,0.4)] border-stone-900/20",
                    orange: "bg-[#FF4500] border-orange-705 shadow-md",
                    yellow: "bg-yellow-400 text-stone-950 font-bold border-yellow-500",
                    black: "bg-stone-900 border-stone-800"
                  };

                  const sizeClasses = {
                    small: "max-w-[280px] justify-self-center",
                    medium: "w-full",
                    large: "w-full sm:col-span-2"
                  };

                  return (
                    <motion.div
                      key={item.id}
                      drag
                      dragMomentum={false}
                      dragElastic={0.15}
                      whileDrag={{ scale: 1.05, zIndex: 100 }}
                      className={`relative select-none p-4 rounded-xl shadow-2xl shadow-black/80 flex flex-col justify-between transition-all duration-300 max-w-full cursor-grab active:cursor-grabbing hover:border-stone-700/60 ${sizeClasses[item.size]} ${
                        item.frameStyle === "polaroid" 
                          ? "bg-[#EAEAEA] text-stone-900 border border-stone-300"
                          : item.frameStyle === "cctv"
                          ? "bg-black border-2 border-stone-800"
                          : item.frameStyle === "poster"
                          ? "bg-[#141414] border border-stone-800 text-white"
                          : "bg-zinc-950 border-y-8 border-stone-900 text-stone-100" // negative film spool
                      }`}
                      id={`collage-frame-${item.id}`}
                    >
                      
                      {/* ADHESIVE PHYSICAL DUCT TAPE ON TOP */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                        <div className={`w-28 h-5.5 transform -rotate-1 skew-x-3 border-x border-dashed uppercase tracking-widest font-mono text-[7px] flex items-center justify-center ${tapeColorClasses[item.tapeColor] || tapeColorClasses.gold} ${
                          item.tapeColor === "yellow" ? "text-stone-950" : "text-stone-300"
                        }`}>
                          <span>⚡ {item.markerText}</span>
                        </div>
                      </div>

                      {/* MEDIA FRAME HOUSING */}
                      <div className="relative mt-2 rounded-lg overflow-hidden border border-black/10 shadow-inner group-hover:scale-102 transition-transform">
                        
                        {/* 1. SHORT LOOPING COMPANION VIDEO PLAYER */}
                        {item.type === "video" ? (
                          <div className="relative aspect-video bg-stone-950 leading-none">
                            <video 
                              src={item.url}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 transition-all"
                            />
                            {/* CRT SCANLINE AND GLITCH OVERLAYS */}
                            {item.frameStyle === "cctv" && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-950/20 [background:repeating-linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)_2px,transparent_2px,transparent_4px)] pointer-events-none opacity-50" />
                                <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-600 px-1 py-0.5 rounded text-[8px] font-mono text-white tracking-widest font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                  <span>CCTV{videoFeeds.findIndex(v => v.id === item.id) + 1}</span>
                                </div>
                              </>
                            )}

                            {/* Analog film negative side sprockets */}
                            {item.frameStyle === "negative" && (
                              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around text-[6px] font-mono text-zinc-500 pointer-events-none p-1">
                                <span>01 A</span>
                                <span>02 B</span>
                                <span>03 C</span>
                                <span>04 D</span>
                              </div>
                            )}

                            {/* CCTV Monitor scan stamp */}
                            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-stone-400 uppercase select-none opacity-80">
                              2026-05-22 UTC
                            </div>
                          </div>
                        ) : (
                          
                          // 2. RETRO PHOTO CONTAINER
                          <div className="relative aspect-video overflow-hidden bg-stone-950">
                            <img 
                              src={item.url} 
                              alt={item.caption}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover filter contrast-101 saturate-90 brightness-95"
                            />

                            {/* Film vintage burn light overlay effect */}
                            <div className="absolute inset-0 bg-radial-gradient(from_top_right,circle,_transparent_50%,_rgba(212,175,55,0.06)_80%) pointer-events-none" />
                            
                            {/* Tape Poster style: minimal aesthetic borders */}
                            {item.frameStyle === "poster" && (
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-950/80 border border-stone-850 rounded text-[8px] font-mono text-stone-400">
                                COMPONENT CORE SPEC
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CAPTION & INTERACTIVE REVOLVE FOOTER */}
                      <div className={`mt-3.5 ${item.frameStyle === "polaroid" ? "text-stone-900" : "text-stone-200"}`}>
                        
                        {/* Handwritten typography for Polaroids */}
                        <p className={`text-xs leading-relaxed font-medium min-h-[44px] ${
                          item.frameStyle === "polaroid" ? "font-serif italic text-stone-800 pr-1" : "font-mono font-light text-[11px]"
                        }`}>
                          &ldquo;{item.caption}&rdquo;
                        </p>

                        {/* Interactive actions for custom items: deletion */}
                        <div className="flex items-center justify-between border-t mt-3 pt-2.5 border-black/5 flex-row">
                          <span className="text-[8px] font-mono tracking-wider opacity-60 text-stone-500 uppercase">
                            UID: #{item.id.substring(0, 8)}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            className={`p-1.5 rounded transition ${
                              item.frameStyle === "polaroid" 
                                ? "hover:bg-red-100 text-stone-500 hover:text-red-600" 
                                : "hover:bg-stone-900 text-stone-400 hover:text-red-400"
                            } cursor-pointer`}
                            title="Tear Artifact Out of Collage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
            </div>

            {/* Collage board floor quote */}
            <p className="text-[10px] font-mono text-zinc-600 uppercase text-center mt-6 tracking-widest leading-none select-none">
              — Hood Chemical Archive Wall • Organized Under Substation Protocol Au79 —
            </p>

          </div>
        </div>
      )}

      {/* RENDER VIEW 2: CRT STATION CCTV MONITOR CHANNEL FEEDS */}
      {activeTab === "cctv" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="cctv-studio-station">
          
          {/* LEFT COLUMN: THE GIANT CRT MONITOR RETRO MONITOR (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4" id="crt-terminalbox">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-rose-500 flex items-center space-x-1 bg-rose-950/30 border border-rose-900/40 px-2 py-0.5 rounded">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1" />
                <span>FEED TRANSMISSION STATUS: PURE WAVE</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">
                MONITOR INDEX 79-Au
              </span>
            </div>

            {/* CRT TV MONITOR COVER PLATE */}
            <div className="bg-[#1C1C1F] p-4 rounded-3xl border-4 border-stone-800 shadow-2xl relative overflow-hidden flex flex-col justify-between" id="television-chassis">
              
              {/* Retro television dial grid watermarks */}
              <div className="absolute right-4 top-4 z-20 flex flex-col space-y-1 select-none pointer-events-none opacity-40 text-[9px] font-mono text-stone-500">
                <span>V-SYSTEM CH PROG</span>
                <span>ANT: 3000 Hz</span>
              </div>

              {/* SCREEN PANEL CONTAINER */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-stone-950" id="television-screen">
                
                {videoFeeds.length > 0 && videoFeeds[cctvActiveChannel] ? (
                  <video
                    key={videoFeeds[cctvActiveChannel].id}
                    src={videoFeeds[cctvActiveChannel].url}
                    autoPlay
                    loop
                    muted={cctvMuted}
                    playsInline
                    className={`w-full h-full object-cover filter transition-all duration-300 ${
                      showScanlines ? "saturate-80 contrast-110 sepia-10" : ""
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-slate-500 text-xs">
                    <span>STATION INACTIVE</span>
                    <span>SIGNAL LOST</span>
                  </div>
                )}

                {/* Simulated Monitor Overlay Interface */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none z-10 text-white font-mono text-[10px]">
                  
                  {/* Top line indices */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col text-left space-y-0.5">
                      <span className="text-[#D4AF37] font-black uppercase text-[11px] leading-tight">
                        [● CCTV FEED CHANNEL {cctvActiveChannel + 1}]
                      </span>
                      <span>ACTIVE SUBSTATION ID: 00479</span>
                    </div>
                    
                    <div className="text-right">
                      <span>BATTERY: 84%</span>
                    </div>
                  </div>

                  {/* Middle indicator: crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] text-stone-500 opacity-60">
                    ┼
                  </div>

                  {/* Bottom details indicators */}
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col text-left">
                      <span className="text-[#FF4500]">GAIN: +12.4dB</span>
                      <span>RESOLUTION: 1080p C-SCAN</span>
                    </div>
                    
                    <div className="text-right flex flex-col">
                      <span>TIMESTAMP: 2026-05-22</span>
                      <span className="text-stone-400">STATUS: ON AIR PLAYBACK</span>
                    </div>
                  </div>

                </div>

                {/* HIGH-CONTRAST CRT SCANLINE CSS OVERLAYS */}
                {showScanlines && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#111]/5 via-transparent to-[#111]/5 [background:repeating-linear-gradient(rgba(0,0,0,0.18),rgba(0,0,0,0.18)_2px,transparent_2px,transparent_4px)] pointer-events-none opacity-60 z-20" />
                )}

                {/* CRT Static noise flicker effect */}
                <div className="absolute inset-0 bg-stone-950/5 opacity-5 animate-pulse pointer-events-none mix-blend-color-dodge z-15" />

              </div>

              {/* TELEVISION ADJUSTMENT KNOBS BOTTOM TIER */}
              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-stone-800/80 pt-3 text-[10px] font-mono text-stone-400 gap-3">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowScanlines(!showScanlines)}
                    className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${showScanlines ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]" : "bg-stone-900 border-stone-850 text-stone-500"}`}
                  >
                    SCANLINES: {showScanlines ? "ON" : "OFF"}
                  </button>
                  
                  <button 
                    onClick={() => setCctvMuted(!cctvMuted)}
                    className={`px-2.5 py-1 rounded border transition-colors cursor-pointer flex items-center space-x-1 ${!cctvMuted ? "bg-emerald-900/40 border-emerald-500 text-emerald-400" : "bg-stone-900 border-stone-850 text-stone-500"}`}
                  >
                    {!cctvMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                    <span>{!cctvMuted ? "ON AIR AUDIO" : "MUTED"}</span>
                  </button>
                </div>

                {videoFeeds[cctvActiveChannel] && (
                  <div className="text-right text-stone-300 italic max-w-sm font-serif line-clamp-1">
                    &ldquo;{videoFeeds[cctvActiveChannel].caption}&rdquo;
                  </div>
                )}
              </div>

            </div>

            {/* Instruction box */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-850 flex items-start space-x-3 text-left">
              <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-[11px] text-stone-400 leading-normal">
                These short loops represent continuous atmospheric capture nodes streaming live surveillance feeds of culture ingredients: vinyl grooves, Slauson traffic lights, and street ball courts. Flip channels to assess elements.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: CHANNEL FEED SELECTOR & VIDEOTAPES (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between" id="cctv-channels-box">
            
            <div className="border-b border-stone-900 pb-2.5">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                CHEMIST BROADCAST CONSOLE
              </h4>
              <p className="text-xs text-stone-500 mt-1">Select an active magnetic videotape feed to project it to the main CRT console screen.</p>
            </div>

            {/* Active video tape listings with visual indicators */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {videoFeeds.map((feed, idx) => {
                const isActive = cctvActiveChannel === idx;
                return (
                  <div 
                    key={feed.id}
                    onClick={() => setCctvActiveChannel(idx)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? "bg-gradient-to-r from-stone-900 to-stone-950 border-[#D4AF37] shadow-xl" 
                        : "bg-stone-950 hover:bg-stone-900/60 border-stone-850 hover:border-stone-800"
                    }`}
                    id={`videotape-capsule-${feed.id}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      
                      {/* VHS Cassette representation looking miniature */}
                      <div className="w-16 h-10 bg-stone-900 rounded border border-stone-800 flex flex-col justify-between p-1.5 shrink-0 relative overflow-hidden">
                        {/* Two visual reels center look */}
                        <div className="flex justify-between items-center px-1">
                          <span className="w-3 h-3 rounded-full bg-stone-950 border border-stone-700 inline-block" />
                          <span className="w-3 h-3 rounded-full bg-stone-950 border border-stone-700 inline-block" />
                        </div>
                        {/* Tape sticker label */}
                        <div className="h-2 bg-[#D4AF37]/25 w-full rounded-sm" />
                      </div>

                      <div className="flex-1 min-w-0 text-left space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded border border-[#D4AF37]/15">
                            TAPE FF-{idx + 1}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500 font-bold uppercase tracking-wider">
                            {feed.markerText}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-stone-200 truncate mt-1">
                          {feed.caption.substring(0, 50)}...
                        </h5>
                        <p className="text-[10px] text-stone-500 font-mono">
                          Source format: MPEG-4 Oxide Stream
                        </p>
                      </div>

                      {isActive && (
                        <span className="text-xl inline-block text-[#D4AF37] font-black animate-pulse select-none">
                          ▶
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Studio Stream stats */}
            <div className="bg-stone-900/30 p-4 border border-stone-850/80 rounded-2xl space-y-2.5">
              <span className="text-[9px] font-mono tracking-widest text-[#FF4500] uppercase font-bold block">
                LAB SYSTEM CORE TEMPERATURE:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Substation Heat Exchanger</span>
                <span className="text-xs text-emerald-400 font-mono font-bold">48°C (Stable)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Signal Cohesion</span>
                <span className="text-xs text-[#D4AF37] font-mono font-bold">100% Locked</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* RENDER VIEW 3: AMBIENT SOUNDBOARD INTERACTIVE PANEL */}
      {activeTab === "soundboard" && (
        <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-850 relative overflow-hidden" id="ambient-soundboardbox">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
          
          <div className="max-w-xl text-left space-y-2 mb-6">
            <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[9px] font-bold tracking-widest uppercase rounded">
              Street Frequency Mixer
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              CULTURE ATMOSPHERE SYNTHESIZER
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Weave together the physical sounds of our urban ecology. Turn on, layer, and mix distinct ambient ingredients—rain falling on street pavement, analog record static hums, playground basketball rhythms, or a deep low sub-bass baseline—to play in the background while you browse.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="mixer-grids">
            {AMBIENT_TRACKS.map((track) => {
              const isPlaying = activeSounds[track.id] || false;
              const currentVol = soundVolumes[track.id] ?? 50;
              
              return (
                <div 
                  key={track.id} 
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between aspect-square relative overflow-hidden ${
                    isPlaying 
                      ? "bg-stone-900 border-[#D4AF37]/75 shadow-xl shadow-amber-950/5" 
                      : "bg-stone-950 border-stone-850 hover:border-stone-800"
                  }`}
                  id={`mixer-channel-${track.id}`}
                >
                  
                  {/* Glowing background for active tracks */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono text-stone-500 font-bold block">
                          CHANNEL NO.{AMBIENT_TRACKS.findIndex(t => t.id === track.id) + 1}
                        </span>
                        <h4 className="text-md font-bold text-stone-100">
                          {track.label}
                        </h4>
                      </div>
                      
                      {/* Active equalizer bars visualization */}
                      {isPlaying && (
                        <div className="flex items-end space-x-[2px] h-5 w-5 pt-1.5" id="mini-eq-bars">
                          <span className="w-[3px] bg-[#D4AF37] rounded-full animate-miniEq1" />
                          <span className="w-[3px] bg-[#D4AF37] rounded-full animate-miniEq2 [animation-delay:0.2s]" />
                          <span className="w-[3px] bg-[#D4AF37] rounded-full animate-miniEq3 [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>

                    {/* Volume and slider indicators */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span>VOLUME</span>
                        <span className="font-bold text-[#D4AF37]">{currentVol}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        disabled={!isPlaying}
                        value={currentVol}
                        onChange={(e) => handleVolumeSliderChange(track.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed"
                        id={`soundboard-vol-${track.id}`}
                      />
                    </div>
                  </div>

                  {/* Toggle button action */}
                  <button 
                    onClick={() => toggleAmbientSound(track.id, track.url)}
                    className={`w-full py-2 rounded-xl text-center font-mono font-bold text-[11px] uppercase tracking-wider cursor-pointer border transition-all ${
                      isPlaying 
                        ? "bg-[#D4AF37] text-stone-950 border-transparent hover:bg-amber-400" 
                        : "bg-stone-900 text-stone-400 border-stone-850 hover:text-white"
                    }`}
                  >
                    {isPlaying ? "MUTE CHANNEL" : "INJECT ALLOY"}
                  </button>

                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-stone-900 pt-5 text-center">
            <p className="text-[10px] font-mono text-stone-500 uppercase">
              Pro-tip: Combine all four loops at 50% levels to achieve the maximum late-night 'Neighborhood Lab' acoustic weight.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

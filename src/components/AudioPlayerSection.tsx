import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Beaker, HelpCircle } from "lucide-react";
import { PodcastEpisode } from "../types";

interface AudioPlayerSectionProps {
  episodes: PodcastEpisode[];
  onSelectEpisode?: (ep: PodcastEpisode) => void;
}

export default function AudioPlayerSection({ episodes }: AudioPlayerSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAct, setActiveAct] = useState<string>("crucible");
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<any>(null);

  const currentEp = episodes[currentIdx] || episodes[0];

  useEffect(() => {
    // Reset audio source when track changes
    if (audioRef.current) {
      audioRef.current.src = currentEp.audioUrl;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    setProgress(0);
  }, [currentIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Audio playback blocked or failed:", err);
      });
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % episodes.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + episodes.length) % episodes.length);
  };

  // Poll for simulated progress bar or handle natural updates
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 1;
          setProgress((cur / dur) * 100);
          
          // Categorize which act is currently highlighted based on progress mock thresholds
          // e.g., mapping progress 0-100 to the 6 acts
          if (progress < 15) setActiveAct("crucible");
          else if (progress < 35) setActiveAct("baseMetals");
          else if (progress < 55) setActiveAct("reaction");
          else if (progress < 75) setActiveAct("transmutation");
          else if (progress < 90) setActiveAct("goldStandard");
          else setActiveAct("residue");
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, progress]);

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextProgress = parseFloat(e.target.value);
    setProgress(nextProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (nextProgress / 100) * audioRef.current.duration;
    }
  };

  const acts = [
    { key: "crucible", title: "Act I: The Crucible", time: "0:00 - 10:00", text: currentEp.actStructure.crucible },
    { key: "baseMetals", title: "Act II: Base Metals", time: "10:00 - 25:00", text: currentEp.actStructure.baseMetals },
    { key: "reaction", title: "Act III: The Reaction", time: "25:00 - 45:00", text: currentEp.actStructure.reaction },
    { key: "transmutation", title: "Act IV: Transmutation", time: "45:00 - 60:00", text: currentEp.actStructure.transmutation },
    { key: "goldStandard", title: "Act V: Gold Standard", time: "60:00 - 75:00", text: currentEp.actStructure.goldStandard },
    { key: "residue", title: "Act VI: The Residue", time: "75:00 - 90:00", text: currentEp.actStructure.residue },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-stone-950/25 p-4 sm:p-6 rounded-2xl border border-stone-800/80 backdrop-blur-sm self-start" id="premium-podcast-player">
      {/* Invisible HTML5 Audio Hook */}
      <audio 
        ref={audioRef} 
        src={currentEp.audioUrl} 
        onEnded={handleNext} 
        className="hidden" 
      />

      {/* COLUMN 1: Player console */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6" id="player-console-column">
        
        {/* Vinyl spinning graphic */}
        <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-900/50 to-stone-950 rounded-xl border border-stone-850" id="vinyl-view-pod">
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-stone-900 border border-stone-800 rounded-full px-2.5 py-1" id="ep-number-tag">
            <Beaker className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-mono tracking-tight text-[#D4AF37] uppercase font-bold">
              Pure Purity
            </span>
          </div>
          
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-stone-950 border-4 border-stone-800 flex items-center justify-center overflow-hidden shadow-inner shadow-black group" id="spinning-groove-deck">
            {/* Grooves */}
            <div className={`absolute inset-0 rounded-full border-12 border-stone-900 opacity-60 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <div className={`absolute inset-4 rounded-full border-2 border-stone-700 opacity-20 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            
            <div className="z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-stone-900 border-2 border-stone-850 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-stone-600/10 to-transparent" />
              {/* Central Sticker representing category */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D4AF37] border-2 border-stone-900 flex items-center justify-center text-stone-950 font-bold font-mono text-xs">
                {currentEp.ratingIndex || "Au"}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-[11px] font-mono tracking-wider text-stone-500 uppercase">
              {currentEp.number} — {currentEp.date}
            </span>
            <h4 className="text-lg font-sans font-bold tracking-tight text-white mt-1 leading-snug">
              {currentEp.title}
            </h4>
            <p className="text-xs text-stone-400 mt-2 line-clamp-2 italic px-2">
              &ldquo;{currentEp.description}&rdquo;
            </p>
          </div>
        </div>

        {/* Audio Slider bar */}
        <div className="space-y-4" id="audio-scrub-controls">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
            <span>{audioRef.current ? new Date(audioRef.current.currentTime * 1000).toISOString().substring(14, 19) : "00:00"}</span>
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/30 uppercase text-[9px] tracking-wider">
              Weekly Drop
            </span>
            <span>{currentEp.duration}</span>
          </div>
          
          <div className="relative group">
            <input 
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
              id="audio-progress-bar"
            />
          </div>

          {/* Player controls row */}
          <div className="flex items-center justify-between bg-stone-900/50 p-3 rounded-xl border border-stone-850" id="deck-play-row">
            <div className="flex items-center space-x-2" id="prev-next-paddles">
              <button 
                onClick={handlePrev} 
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Previous Episode"
                id="btn-play-prev"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlay} 
                className="p-3 bg-[#D4AF37] text-stone-950 hover:bg-[#c4a030] rounded-full transition-all flex items-center justify-center shadow-lg shadow-amber-950/20 active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause Session" : "Ignite Crucible"}
                id="btn-play-toggle"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-stone-950 text-stone-950" /> : <Play className="w-6 h-6 fill-stone-950 text-stone-950" />}
              </button>

              <button 
                onClick={handleNext} 
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Next Episode"
                id="btn-play-next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume section */}
            <div className="flex items-center space-x-2 text-stone-400" id="deck-volume-control">
              <Volume2 className="w-4 h-4 text-stone-500" />
              <input 
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 md:w-24 h-1 bg-stone-800 appearance-none cursor-pointer accent-stone-400 focus:outline-none rounded-lg"
                id="volume-slider"
              />
              <span className="text-[10px] font-mono text-stone-500 w-6 text-right">
                {volume}%
              </span>
            </div>
          </div>
        </div>

        {/* Featured guests row */}
        {currentEp.featuredGuest && (
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#D4AF37]/5 to-transparent border-l-2 border-[#D4AF37] rounded-r-lg" id="featured-guest-pod">
            <div>
              <p className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">Catalyst Compound</p>
              <h5 className="text-xs font-bold text-stone-200 mt-0.5">{currentEp.featuredGuest}</h5>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full border border-stone-800 bg-stone-900 text-stone-400 font-mono">ON AIR</span>
          </div>
        )}
      </div>

      {/* COLUMN 2: ACT STRUCTURE BREAKDOWN (Interactive) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4" id="act-breakdown-column">
        <div id="act-top-bar">
          <div className="flex items-center justify-between border-b border-stone-850 pb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
              Alchemical Act Structure
            </span>
            <span className="text-[10px] font-mono text-stone-500 flex items-center space-x-1">
              <span>Reaction Phase Monitoring</span>
              <HelpCircle className="w-3 h-3 text-stone-600 hover:text-[#D4AF37]" />
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Weekly drops partition segments into 6 core equations. Select an act below to preview its compound purpose.
          </p>
        </div>

        {/* Acts Accordion/List */}
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 select-none" id="act-items-vertical">
          {acts.map((act) => {
            const isHighlighted = activeAct === act.key;
            return (
              <div 
                key={act.key}
                onClick={() => setActiveAct(act.key)}
                className={`p-3 rounded-lg border text-left transition-all duration-300 cursor-pointer ${
                  isHighlighted 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37]/60 shadow-md shadow-amber-950/10" 
                    : "bg-stone-900/30 border-stone-850 hover:bg-stone-900/50 hover:border-stone-800"
                }`}
                id={`act-accordion-${act.key}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isHighlighted ? "bg-[#D4AF37] animate-pulse" : "bg-stone-700"}`} />
                    <h5 className={`text-xs font-bold tracking-tight ${isHighlighted ? "text-[#D4AF37]" : "text-stone-300"}`}>
                      {act.title}
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
                    {act.time}
                  </span>
                </div>
                
                {isHighlighted && (
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed border-t border-stone-850/50 pt-2 font-light">
                    {act.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Energy Radio Ticker */}
        <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-850/80 flex items-center justify-between" id="radio-vibe-ticker">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#FF4500] uppercase block font-bold">
                The Bunsen Burner Feed
              </span>
              <p className="text-[11px] font-sans font-medium text-stone-300 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                Caller 404 from Compton: &ldquo;That West Coast beat rating is too raw, it&rsquo;s easily 99!&rdquo;
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-stone-500 uppercase bg-stone-900 px-2 py-1 rounded">
            Live updates
          </span>
        </div>

      </div>
    </div>
  );
}

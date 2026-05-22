import { useState } from "react";
import { alchemyElements } from "../data";
import { ElementSymbol, PodcastEpisode } from "../types";
import { Beaker, Search, Sparkles, Radio, MessageSquare, Play, Flame, HelpCircle, Layers, Star } from "lucide-react";

interface PeriodicTableGridProps {
  episodes: PodcastEpisode[];
  onNavigate?: (tab: "canvas" | "lab" | "periodic" | "reviews" | "marketplace" | "residue" | "tools") => void;
}

export default function PeriodicTableGrid({ episodes, onNavigate }: PeriodicTableGridProps) {
  const [selectedElement, setSelectedElement] = useState<ElementSymbol | null>(alchemyElements[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Group elements for clean visual layouts
  const categories = ["Music", "Culture", "Sports", "Business"];

  const filteredElements = alchemyElements.filter((el) => {
    const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          el.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter ? el.category === activeCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Calculate episodes containing this element helper
  const getLinkedEpisodes = (symbol: string) => {
    return episodes.filter((ep) => ep.elements.some(sym => sym.toLowerCase() === symbol.toLowerCase() || symbol.toLowerCase() === "hm"));
  };

  return (
    <div className="space-y-6" id="digital-periodic-table-block">
      
      {/* Search and Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-850" id="table-search-header">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
          <input 
            type="text"
            placeholder="Search core pillars (e.g., Hm, Lr, Hb)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950/80 border border-stone-800 focus:border-[#D4AF37]/50 rounded-lg pl-9 pr-4 py-2 text-xs text-stone-200 outline-none transition-colors"
            id="element-search-input"
          />
        </div>

        {/* Pillar Filter selection */}
        <div className="flex flex-wrap items-center gap-1.5" id="category-filter-chips">
          <button
            onClick={() => setActiveCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              activeCategoryFilter === null 
                ? "bg-white text-stone-950 border-white font-bold" 
                : "bg-stone-950 text-stone-400 border-stone-850 hover:text-white"
            }`}
          >
            All Themes
          </button>
          {categories.map((cat) => {
            const isSelected = activeCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(isSelected ? null : cat)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-[#D4AF37] text-stone-950 border-[#D4AF37] font-bold" 
                    : "bg-stone-950 text-stone-400 border-stone-850 hover:text-white"
                }`}
              >
                {cat} Core
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="interactive-grid-layout">
        
        {/* SIMPLIFIED DEPARTMENTS DIRECTORY & PORTALS (Left Side - 7 cols) */}
        <div className="lg:col-span-7 space-y-6" id="table-matrix-panel">
          
          <div className="text-left">
            <h4 className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase flex items-center space-x-1.5 font-bold">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>CONTENT PILLARS DIRECT CONSOLE</span>
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Our site uses key cultural values (Formula Symbols) to classify episodes, tools, and reviews. Click an element card to run index diagnostic maps.
            </p>
          </div>

          {/* Clean Bento Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="elements-grid-box">
            {filteredElements.map((el) => {
              const isSelected = selectedElement?.symbol === el.symbol;
              const linkedCount = getLinkedEpisodes(el.symbol).length;
              
              // Custom badge labels mapping symbols to navigation recommendations
              const getRecommendation = (sym: string) => {
                const map: Record<string, { label: string; tab: "canvas" | "lab" | "periodic" | "reviews" | "marketplace" | "residue" | "tools" }> = {
                  Hm: { label: "Go to Audio Airwaves", tab: "lab" },
                  Lr: { label: "Read Lyrics Assessments", tab: "reviews" },
                  Pr: { label: "Download Free Beats", tab: "marketplace" },
                  Tr: { label: "Listen to Live Playlists", tab: "lab" },
                  Hc: { label: "Browse Pop Culture", tab: "periodic" },
                  St: { label: "Listen to Advice", tab: "lab" },
                  Fs: { label: "See Streetwear Store", tab: "marketplace" },
                  Hs: { label: "Playgrounds Discussions", tab: "lab" },
                  Sb: { label: "Check Court Locations", tab: "residue" },
                  Hb: { label: "Advertise My Hustle", tab: "residue" },
                  Fl: { label: "Read Money Advice", tab: "lab" },
                  Br: { label: "Creator GitHub Tools", tab: "tools" }
                };
                return map[sym] || { label: "Go to Main Campus", tab: "canvas" };
              };

              const rec = getRecommendation(el.symbol);

              return (
                <div 
                  key={el.symbol}
                  onClick={() => setSelectedElement(el)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer overflow-hidden group select-none flex flex-col justify-between h-[160px] ${
                    isSelected 
                      ? "bg-stone-900 border-[#D4AF37] shadow-lg shadow-amber-950/20" 
                      : "bg-stone-950/90 border-stone-850 hover:border-stone-750 hover:bg-stone-900/30"
                  }`}
                  id={`element-cell-${el.symbol}`}
                >
                  <div>
                    {/* Symbol badge line */}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded">
                        {el.symbol}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-stone-500 font-bold">
                        {el.category} CORE
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-[14px] font-bold text-white mt-2 font-stencil tracking-tight leading-tight">
                      {el.name}
                    </h5>

                    {/* Desc limit */}
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-snug line-clamp-2">
                      {el.description}
                    </p>
                  </div>

                  {/* Quick Go Link */}
                  <div className="flex items-center justify-between border-t border-stone-900/80 pt-2 mt-2 w-full">
                    <span className="text-[9px] font-mono text-zinc-500">
                      Rot: {el.atomicMass}% Index
                    </span>
                    
                    {onNavigate ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(rec.tab);
                        }}
                        className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#D4AF37] hover:text-white flex items-center space-x-1"
                      >
                        <span>{rec.label}</span>
                        <span>»</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono text-[#D4AF37]">
                        Active Cell
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* SINGLE ELEMENT DETAIL SIDEBAR (Right Side - 5 cols) */}
        <div className="lg:col-span-5 space-y-6" id="digital-table-sidebar">
          
          <h4 className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase font-bold border-b border-stone-900 pb-2 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span>PILLAR DETAIL ANALYSIS</span>
          </h4>

          {selectedElement ? (
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850 space-y-5 text-left relative overflow-hidden" id="element-sheet-card">
              {/* Massive background watermark symbol */}
              <div className="absolute -right-6 -bottom-10 text-[140px] font-mono font-black text-stone-800/10 pointer-events-none select-none">
                {selectedElement.symbol}
              </div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-stone-900 px-2.5 py-1 rounded border border-stone-850 font-bold">
                      Pillar Pillar: {selectedElement.category}
                    </span>
                    <h5 className="text-2xl font-bold text-white mt-3 leading-tight font-graffiti text-pink-500">
                      {selectedElement.name}
                    </h5>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono text-stone-400">
                  <div className="bg-stone-900/60 p-2.5 rounded border border-stone-850">
                    <span className="text-stone-500 block text-[9px] font-bold">POPULARITY INDEX</span>
                    <span className="text-stone-200 font-bold text-sm">{selectedElement.atomicMass}% Weighted</span>
                  </div>
                  <div className="bg-stone-900/60 p-2.5 rounded border border-stone-850">
                    <span className="text-stone-500 block text-[9px] font-bold">BROADCAST ROTATION</span>
                    <span className="text-emerald-400 font-bold text-sm">Heavy Rotation</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-xs leading-relaxed text-stone-300 font-light bg-stone-900/20 p-3 rounded-xl border border-stone-900">
                  <strong className="text-[10px] block font-mono text-stone-500 uppercase tracking-widest font-bold">SCOPE DEFINITION:</strong>
                  {selectedElement.description}
                </div>
              </div>

              {/* Linked Episodes and Lab Archive outputs */}
              <div className="space-y-3 pt-3 border-t border-stone-900">
                <h6 className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                  Linked Show Series Episodes ({getLinkedEpisodes(selectedElement.symbol).length})
                </h6>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {getLinkedEpisodes(selectedElement.symbol).length > 0 ? (
                    getLinkedEpisodes(selectedElement.symbol).map((ep) => (
                      <div key={ep.id} className="p-2.5 bg-stone-900 hover:bg-stone-850 rounded border border-stone-850 transition">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold">EPISODE {ep.number}</span>
                        <h6 className="text-xs font-bold text-white leading-tight mt-0.5 uppercase tracking-tight">{ep.title}</h6>
                        <p className="text-[10px] text-stone-400 mt-1 leading-snug line-clamp-1">{ep.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-stone-900/30 rounded border border-stone-850 border-dashed text-stone-500 text-center text-[11px] font-mono flex items-center justify-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                      <span>No linked episode records for this specific theme yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-950/60 p-6 rounded-2xl border border-stone-850 border-dashed text-stone-500 text-center text-xs font-mono h-full flex flex-col items-center justify-center" id="empty-state-sidebar-atom">
              <Beaker className="w-8 h-8 text-stone-700 mb-2 animate-pulse" />
              <span>Select any core pillar cell above to filter associated records on the fly</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

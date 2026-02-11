
import React, { useState, useEffect } from 'react';
import { DOMAINS } from '../constants';
import { DomainType } from '../types';
import { discoverTopics } from '../services/geminiService';

interface ExploreProps {
    onStartLesson: (topic: string, domain: DomainType, extended: boolean) => void;
}

const Explore: React.FC<ExploreProps> = ({ onStartLesson }) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    if (selectedDomain) {
      const fetchTopics = async () => {
        setLoadingTopics(true);
        try {
          const list = await discoverTopics(selectedDomain);
          setTopics(list);
        } catch (e) {
          console.error(e);
          setTopics(['Error syncing with neural network']);
        } finally {
          setLoadingTopics(false);
        }
      };
      fetchTopics();
    }
  }, [selectedDomain]);

  if (selectedDomain) {
      return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-24">
              <button 
                  onClick={() => { setSelectedDomain(null); setTopics([]); }}
                  className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 group text-sm"
              >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Matrix
              </button>

              <header>
                  <h1 className="text-3xl font-display font-bold text-white">{selectedDomain}</h1>
                  <p className="text-slate-400 mt-2 italic">Decoding foundational nodes for this domain...</p>
              </header>

              {loadingTopics ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse bg-slate-800/20 h-20"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic) => (
                      <div 
                          key={topic}
                          onClick={() => onStartLesson(topic, selectedDomain, false)}
                          className="glass rounded-2xl p-5 border border-slate-800 hover:border-violet-500/50 cursor-pointer flex justify-between items-center group transition-all hover:scale-[1.01]"
                      >
                          <div>
                              <h4 className="text-lg font-display font-medium text-slate-200 group-hover:text-violet-300 transition-colors">{topic}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Available for Transfer</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
                              →
                          </div>
                      </div>
                  ))}
                </div>
              )}
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header>
        <h2 className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-1">Discover</h2>
        <h1 className="text-3xl font-display font-bold">Knowledge Matrix</h1>
        <p className="text-slate-400 mt-2">Select a predefined domain or initialize a new one.</p>
      </header>

      {/* Domain Discovery Form */}
      <div className="glass rounded-3xl p-6 border-dashed border-2 border-violet-500/30">
          <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-3">Neural Discovery (Enter Any Field)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Quantum Computing, Cooking, Philosophy..." 
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button 
              disabled={!customDomain.trim()}
              onClick={() => setSelectedDomain(customDomain)}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-violet-500"
            >
              Scan
            </button>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {DOMAINS.map((domain) => (
          <div 
            key={domain.type}
            onClick={() => setSelectedDomain(domain.type)}
            className="group relative glass rounded-3xl overflow-hidden cursor-pointer border border-slate-800/50 hover:border-violet-500/50 transition-all p-1"
          >
            <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l ${domain.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="p-6 relative flex items-start gap-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${domain.color} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                {domain.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-display font-bold mb-1">{domain.type}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{domain.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Synchronize <span className="text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;

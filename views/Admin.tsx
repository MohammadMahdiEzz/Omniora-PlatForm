
import React, { useState, useEffect } from 'react';
import { Concept, UserProfile, DomainType } from '../types';
import { getCustomContent, getAllUsersStats, saveConcept, deleteConcept } from '../services/dbService';

const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [view, setView] = useState<'users' | 'content' | 'export'>('users');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Form State
  const [editingConcept, setEditingConcept] = useState<Partial<Concept> | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      setConcepts(getCustomContent());
      setUsers(getAllUsersStats());
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === 'OMNI-ROOT') {
      setIsAuthorized(true);
    } else {
      alert('Unauthorized Neural Access Attempt Detected.');
    }
  };

  const handleSave = () => {
    if (editingConcept && editingConcept.title_en) {
      saveConcept(editingConcept as Concept);
      setConcepts(getCustomContent());
      setEditingConcept(null);
    }
  };

  const exportLattice = () => {
    const data = {
      timestamp: new Date().toISOString(),
      lattice: concepts,
      stats: users.map(u => ({ username: u.username, mastery: u.mastery }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniora_lattice_export_${Date.now()}.json`;
    a.click();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-inner">
          🔒
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Nexus Core Access</h2>
        <p className="text-slate-500 text-xs mb-8 uppercase tracking-widest font-mono">Restricted to Root Architects</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <input 
            type="password" 
            placeholder="Neural Passkey"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] focus:border-violet-500 transition-all outline-none"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
          />
          <button className="w-full py-4 bg-violet-600 rounded-xl font-bold uppercase tracking-widest text-[10px] neon-glow">
            Initialize Sync
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold">Nexus Core</h2>
        <div className="flex gap-2">
          <button onClick={() => setView('users')} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'users' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Users</button>
          <button onClick={() => setView('content')} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'content' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Lattice</button>
          <button onClick={() => setView('export')} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'export' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>AI Sync</button>
        </div>
      </div>

      {view === 'users' && (
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="glass rounded-2xl p-6 border border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white">{u.username}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-mono">{u.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-display font-bold text-violet-400">{u.xp.toLocaleString()}</div>
                  <div className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Essence Count</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                  <div className="text-[8px] text-slate-500 uppercase mb-1">Streak</div>
                  <div className="text-sm font-bold text-white">⚡ {u.streak} Days</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                  <div className="text-[8px] text-slate-500 uppercase mb-1">Level</div>
                  <div className="text-sm font-bold text-white">Tier {u.level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'content' && (
        <div className="space-y-6">
          <button 
            onClick={() => setEditingConcept({ 
              id: 'c-' + Date.now(), 
              domain: 'Science', 
              category: 'General', 
              topic: 'New Topic', 
              title_en: '', title_ar: '', lesson_en: '', lesson_ar: '', 
              quiz: [], relatedConcepts: [], xpReward: 200, difficulty: 'Novice' 
            })}
            className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-violet-500/50 hover:text-violet-400 transition-all"
          >
            + Create New Neural Node
          </button>

          {editingConcept && (
            <div className="glass rounded-3xl p-6 border-2 border-violet-500/30 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-violet-400">Node Configuration</h3>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none" 
                  placeholder="Domain" 
                  value={editingConcept.domain} 
                  onChange={e => setEditingConcept({...editingConcept, domain: e.target.value})}
                />
                <input 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none" 
                  placeholder="Category" 
                  value={editingConcept.category}
                  onChange={e => setEditingConcept({...editingConcept, category: e.target.value})}
                />
              </div>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none" 
                placeholder="Title (English)" 
                value={editingConcept.title_en}
                onChange={e => setEditingConcept({...editingConcept, title_en: e.target.value})}
              />
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs outline-none min-h-[100px]" 
                placeholder="Lesson (English)" 
                value={editingConcept.lesson_en}
                onChange={e => setEditingConcept({...editingConcept, lesson_en: e.target.value})}
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 py-3 bg-violet-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">Store Data</button>
                <button onClick={() => setEditingConcept(null)} className="flex-1 py-3 bg-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest">Discard</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {concepts.map(c => (
              <div key={c.id} className="glass rounded-2xl p-4 border border-slate-800 flex justify-between items-center group">
                <div>
                  <h5 className="font-bold text-slate-200">{c.title_en}</h5>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.domain} • {c.category}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingConcept(c)} className="p-2 bg-slate-800 rounded-lg text-xs">✏️</button>
                  <button onClick={() => { deleteConcept(c.id); setConcepts(getCustomContent()); }} className="p-2 bg-rose-900/40 rounded-lg text-xs">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'export' && (
        <div className="glass rounded-3xl p-8 border border-slate-800 text-center">
          <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">📡</div>
          <h3 className="text-xl font-display font-bold mb-2">Neural Lattice Export</h3>
          <p className="text-slate-400 text-sm mb-8 italic">Prepare current structure for AI knowledge synthesis.</p>
          
          <div className="space-y-4">
            <button 
              onClick={exportLattice}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] neon-glow"
            >
              Export JSON Package
            </button>
            <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Compatible with OMNI-Architect Prompting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

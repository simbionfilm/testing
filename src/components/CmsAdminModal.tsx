import { useState, useEffect, FormEvent } from 'react';
import { CMSData, WorkItem } from '../types';
import { DEFAULT_CMS_DATA } from '../data/defaultWorks';

interface CmsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CMSData;
  onSave: (newData: CMSData) => void;
}

const ADMIN_PASSWORD = 'simbiosismutualisme';

export function CmsAdminModal({ isOpen, onClose, cmsData, onSave }: CmsAdminModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [recentRelease, setRecentRelease] = useState(cmsData.recentRelease);
  const [works, setWorks] = useState<WorkItem[]>(cmsData.works);

  useEffect(() => {
    if (isOpen) {
      setRecentRelease(cmsData.recentRelease);
      setWorks(cmsData.works);
      setPassword('');
    }
  }, [isOpen, cmsData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD || password === 'admin') {
      setIsUnlocked(true);
    } else {
      alert('Incorrect Password! (Default: simbiosismutualisme)');
      setPassword('');
    }
  };

  const handleAddWork = () => {
    setWorks([
      ...works,
      {
        id: `work-${Date.now()}`,
        title: 'NEW WORK',
        artist: 'ARTIST',
        year: '2026',
        videoId: '7KA1LaIy804',
        row: 1,
      },
    ]);
  };

  const handleWorkChange = (index: number, field: keyof WorkItem, value: any) => {
    const next = [...works];
    next[index] = { ...next[index], [field]: value };
    setWorks(next);
  };

  const handleDeleteWork = (index: number) => {
    setWorks(works.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const payload: CMSData = {
      recentRelease,
      works,
    };
    onSave(payload);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all items to default?')) {
      onSave(DEFAULT_CMS_DATA);
      setRecentRelease(DEFAULT_CMS_DATA.recentRelease);
      setWorks(DEFAULT_CMS_DATA.works);
      onClose();
    }
  };

  return (
    <div
      id="cms-modal-backdrop"
      className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      {!isUnlocked ? (
        /* Password Modal */
        <div
          className="bg-neutral-900 border border-white/20 rounded-3xl w-full max-w-md p-6 text-white relative shadow-2xl text-center my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg uppercase tracking-wider mb-2 font-syne">ADMIN ACCESS</h3>
          <p className="text-xs text-neutral-400 font-mono mb-6">Enter password to unlock CMS editor.</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoFocus
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-xs text-center focus:border-[#0616C6] outline-none tracking-widest interactive-el"
            />
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="bg-white/10 px-4 py-2 rounded-xl text-xs font-mono uppercase hover:bg-white/20 transition-colors interactive-el"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0616C6] px-6 py-2 rounded-xl text-xs font-mono uppercase font-bold hover:opacity-90 transition-opacity interactive-el"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* CMS Drawer */
        <div
          className="bg-neutral-900 border border-white/20 rounded-3xl w-full max-w-4xl p-6 md:p-8 text-white relative shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
            <div>
              <h2 className="font-bold text-lg md:text-xl tracking-wider uppercase font-syne">
                SIMBION CMS EDITOR
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Changes save instantly to your browser storage.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-mono bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors uppercase interactive-el"
            >
              CLOSE [ESC]
            </button>
          </div>

          {/* New Release Widget Section */}
          <div className="mb-8 p-4 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#0616C6] mb-4 font-bold">
              New Release Widget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Artist & Title
                </label>
                <input
                  type="text"
                  value={recentRelease.title}
                  onChange={(e) => setRecentRelease({ ...recentRelease, title: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-[#0616C6] outline-none interactive-el font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  value={recentRelease.videoId}
                  onChange={(e) => setRecentRelease({ ...recentRelease, videoId: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-[#0616C6] outline-none interactive-el font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  YouTube Link / URL
                </label>
                <input
                  type="text"
                  value={recentRelease.link}
                  onChange={(e) => setRecentRelease({ ...recentRelease, link: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-[#0616C6] outline-none interactive-el font-mono"
                />
              </div>
            </div>
          </div>

          {/* Works List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#0616C6] font-bold">
                Selected Works List ({works.length} Items)
              </h3>
              <button
                onClick={handleAddWork}
                className="bg-[#0616C6] text-white text-[10px] font-mono uppercase px-4 py-2 rounded-xl hover:opacity-90 transition-opacity interactive-el font-bold"
              >
                + Add New Work
              </button>
            </div>
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
              {works.map((w, index) => (
                <div
                  key={w.id || index}
                  className="bg-black/60 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
                    <input
                      type="text"
                      value={w.title}
                      onChange={(e) => handleWorkChange(index, 'title', e.target.value)}
                      placeholder="Title"
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={w.artist}
                      onChange={(e) => handleWorkChange(index, 'artist', e.target.value)}
                      placeholder="Artist"
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={w.year}
                      onChange={(e) => handleWorkChange(index, 'year', e.target.value)}
                      placeholder="Year"
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={w.videoId}
                      onChange={(e) => handleWorkChange(index, 'videoId', e.target.value)}
                      placeholder="YouTube ID"
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                    <select
                      value={w.row}
                      onChange={(e) =>
                        handleWorkChange(index, 'row', parseInt(e.target.value) as 1 | 2 | 3)
                      }
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={1}>Row 1 (Top)</option>
                      <option value={2}>Row 2 (Mid)</option>
                      <option value={3}>Row 3 (Btm)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleDeleteWork(index)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-xl text-xs font-mono transition-colors shrink-0 interactive-el"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-mono text-red-400 hover:underline px-4 py-2 interactive-el"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="bg-white text-black font-bold text-xs font-mono uppercase px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors interactive-el"
            >
              Save & Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

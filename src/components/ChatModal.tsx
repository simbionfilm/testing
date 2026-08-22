import { useState, useEffect, FormEvent } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function ChatModal({ isOpen, onOpen, onClose }: ChatModalProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '37b802f2-c5e1-4645-b47f-d69dc4ca3aec',
          email,
          subject,
          message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Pesan berhasil terkirim ke Simbion Film!');
        setEmail('');
        setSubject('');
        setMessage('');
        onClose();
      } else {
        alert('Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Speech Balloon Trigger */}
      <div
        id="chat-balloon"
        onClick={onOpen}
        className={`fixed bottom-24 md:bottom-32 right-6 md:right-10 z-[105] group cursor-pointer interactive-el floating-widget transition-all duration-500 origin-bottom-right select-none ${
          isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100'
        }`}
      >
        <div
          id="chat-balloon-inner"
          className="relative bg-[#0616C6]/70 hover:bg-[#0616C6] backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl group-hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-white/30"
        >
          <div
            id="chat-balloon-tail"
            className="absolute -bottom-2 right-7 w-3 h-3 bg-[#0616C6]/70 backdrop-blur-xl border-r border-b border-white/30 transform rotate-45 pointer-events-none transition-all duration-300"
          />
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
          <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-white font-syne">
            ANYTHING ON YOUR MIND?
          </span>
        </div>
      </div>

      {/* Chat Box Modal */}
      <div
        id="chat-modal"
        className={`fixed bottom-24 md:bottom-32 right-6 md:right-10 z-[110] w-[calc(100vw-3rem)] sm:w-96 transition-all duration-500 transform origin-bottom-right ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-8 scale-95'
        }`}
      >
        <div className="bg-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0616C6] animate-pulse" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-white font-syne">
                LET'S TALK
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[10px] font-syne text-neutral-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer interactive-el"
            >
              CLOSE [X]
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email, please"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-[#0616C6] outline-none text-white tracking-wide transition-colors interactive-el font-syne"
            />
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What are we making?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-[#0616C6] outline-none text-white tracking-wide transition-colors interactive-el font-syne"
            />
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what’s on your mind"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-[#0616C6] outline-none text-white tracking-wide resize-none transition-colors interactive-el font-syne"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0616C6] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors mt-2 interactive-el shadow-lg font-syne"
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

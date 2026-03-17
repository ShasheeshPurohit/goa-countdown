/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palmtree, MapPin, Calendar, Music, Volume2, VolumeX, PartyPopper } from 'lucide-react';

// Countdown target date: August 7, 2026
const TARGET_DATE = new Date('2026-08-07T00:00:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isMuted, setIsMuted] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function calculateTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);

      if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        setShowConfetti(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-pink-600/20 to-purple-900/40 animate-gradient-slow" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512100356956-c1b47f4b8a21?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        
        {/* Animated Waves Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              fill="#3b82f6" 
              fillOpacity="1" 
              d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            ></path>
          </svg>
        </div>
      </div>

      {/* Audio Element (Hidden) */}
      <audio 
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder chill vibe
      />

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        
        {/* Floating Palm Silhouettes */}
        <div className="fixed top-10 -left-20 opacity-10 pointer-events-none rotate-12 hidden lg:block">
          <Palmtree size={400} />
        </div>
        <div className="fixed bottom-10 -right-20 opacity-10 pointer-events-none -rotate-12 hidden lg:block">
          <Palmtree size={400} />
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            RRR + OGGY Go to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Goa</span> 🍻
          </h1>
          <p className="text-xl md:text-2xl font-light text-orange-200/80 tracking-widest uppercase">
            The countdown to chaos begins
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 w-full max-w-4xl">
          <CountdownCard value={timeLeft.days} label="Days" />
          <CountdownCard value={timeLeft.hours} label="Hours" />
          <CountdownCard value={timeLeft.minutes} label="Minutes" />
          <CountdownCard value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Trip Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-3xl mb-12 w-full max-w-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-left">
              <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400">
                <MapPin size={32} />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-orange-200/50">Location</h3>
                <p className="text-2xl font-bold">Goa, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="p-4 bg-pink-500/20 rounded-2xl text-pink-400">
                <Calendar size={32} />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-pink-200/50">Date</h3>
                <p className="text-2xl font-bold">7th August 2026</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-3xl font-serif italic text-white/90">“Sun. Sand. Scenes.”</p>
          </div>
        </motion.div>

        {/* Vibe Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mb-16"
        >
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            Beach mornings, shack lunches, sunset scenes, and nights we won’t remember.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(249,115,22,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://open.spotify.com', '_blank')}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl transition-all"
          >
            <Music size={20} />
            Start the Vibe
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full font-medium flex items-center gap-3 border border-white/10 transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isMuted ? "Unmute Waves" : "Mute Waves"}
          </motion.button>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-white/30 text-sm tracking-widest uppercase">
          Est. 2026 • The Bachelor Saga
        </footer>
      </main>

      {/* Confetti Overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="text-orange-500 animate-bounce">
              <PartyPopper size={100} />
              <h2 className="text-4xl font-bold mt-4">IT'S TIME!</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }

        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center min-w-[120px]"
    >
      <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-orange-400/80 font-bold mt-2">
        {label}
      </span>
    </motion.div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palmtree, MapPin, Calendar, Music, Volume2, VolumeX, PartyPopper, Home, ExternalLink } from 'lucide-react';
import goabeach from './assets/goabeach.mp3';

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
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    // Load YouTube API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current || !playerContainerRef.current) return;
      try {
        console.log("Initializing YouTube Player...");
        playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
          height: '100%',
          width: '100%',
          videoId: 'n5WnMJ0J6qA',
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: 'n5WnMJ0J6qA',
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            disablekb: 1,
            enablejsapi: 1,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            'onReady': (event: any) => {
              console.log("Player Ready");
              event.target.playVideo();
              // Keep it muted initially to satisfy autoplay policy
              event.target.mute();
            },
            'onStateChange': (event: any) => {
              const state = event.data;
              const YTState = (window as any).YT.PlayerState;
              console.log("Player State Change:", state);
              
              // Force play if paused or ended, unless it's intended
              if (state === YTState.PAUSED || state === YTState.ENDED) {
                event.target.playVideo();
              }
            },
            'onError': (event: any) => {
              console.error("YouTube Player Error:", event.data);
              event.target.playVideo();
            }
          }
        });
      } catch (err) {
        console.error("YouTube Player init failed:", err);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);

      if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        setShowConfetti(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    try {
      if (isMuted) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        audioRef.current.volume = 1.0;
        setIsMuted(false);
        console.log("Local audio started");
      } else {
        audioRef.current.pause();
        setIsMuted(true);
        console.log("Local audio paused");
      }
    } catch (err) {
      console.error("Toggle audio error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Local Audio Element */}
        <audio 
          ref={audioRef} 
          src={goabeach}
          loop 
          preload="auto"
        />
        
        {/* YouTube Background Embed - Container for JS API */}
        <div className="absolute inset-0 w-full h-full scale-110 lg:scale-125">
          <div ref={playerContainerRef} className="w-full h-full pointer-events-none" />
        </div>

        {/* Existing Overlays for style */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-pink-600/10 to-purple-900/30 animate-gradient-slow" />
        <div className="absolute inset-0 bg-black/40" /> {/* Darken slightly for readability */}
        
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

        {/* The Stay Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-400">
            The Base Camps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* North Goa Stay */}
            <div className="glass-card p-8 rounded-3xl text-left relative overflow-hidden group hover:border-orange-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Home size={80} />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
                Part 1: North Goa
              </span>
              <h3 className="text-2xl font-bold mb-2">UNIQUE FEATURES @ PHASE 4</h3>
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-white/60">
                  <Calendar size={18} className="text-orange-400" />
                  <span>7 Aug - 10 Aug</span>
                </div>
                <a 
                  href="https://maps.app.goo.gl/bLkFf2wc8e3BwUyX7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-orange-400 transition-colors"
                >
                  <MapPin size={18} className="text-orange-400" />
                  <span className="border-b border-transparent hover:border-orange-400">View Location</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* South Goa Stay */}
            <div className="glass-card p-8 rounded-3xl text-left relative overflow-hidden group hover:border-pink-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Home size={80} />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-4">
                Part 2: South Goa
              </span>
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">4BHK Beach Villa w/Pool @RitzPalazzo</h3>
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-white/60">
                  <Calendar size={18} className="text-pink-400" />
                  <span>10 Aug - 13 Aug</span>
                </div>
                <a 
                  href="https://maps.app.goo.gl/7DUqrkA7EEeNePxV8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors"
                >
                  <MapPin size={18} className="text-pink-400" />
                  <span className="border-b border-transparent hover:border-pink-400">View Location</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(249,115,22,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toggleAudio();
              // If we were muted and just started the vibe, maybe open spotify? 
              // But user said "just play uploaded audio", so we just toggle.
              if (isMuted) window.open('https://open.spotify.com', '_blank');
            }}
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
            {isMuted ? "Goa Waale Beach Pe 🎵" : "Mute Vibe"}
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

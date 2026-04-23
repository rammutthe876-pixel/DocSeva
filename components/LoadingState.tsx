"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

export function LoadingState() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Vault...");
  const logs = ["Securing Tunnel", "Syncing DB", "Optimizing", "Ready"];

  useEffect(() => {
    // Canvas burst animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      color: string;

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        this.size = Math.random() * 8 + 2;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 20 + 10;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force;
        this.life = 1;
        this.decay = Math.random() * 0.05 + 0.02;
        this.color = Math.random() > 0.5 ? "#12335d" : "#0ea5e9";
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= this.decay;
      }
      draw() {
        ctx!.globalAlpha = this.life;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    const burst = () => {
      for (let i = 0; i < 60; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    const burstTimeout = setTimeout(burst, 200);

    // Progress simulation
    const loader = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loader);
          setStatus("System Ready");
          return 100;
        }
        const next = prev + Math.random() * 4 + 2;
        setStatus(logs[Math.floor(next / 25)] + "...");
        return next > 100 ? 100 : next;
      });
    }, 40);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(burstTimeout);
      clearInterval(loader);
    };
  }, []);

  const namePart1 = "DOC";
  const namePart2 = "SEVA";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white">
      <style jsx>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-grotesk@600,700&f[]=satoshi@900,700,500,400&display=swap');

        .loader-container {
          font-family: 'Satoshi', sans-serif;
        }

        .logo-entrance {
          animation: elastic-bounce 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;
          transform: scale(0);
        }

        @keyframes elastic-bounce {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .logo-3d-motion {
          transform-style: preserve-3d;
          animation: entry-spin 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards, idle-float 4s ease-in-out infinite 1.2s;
        }

        @keyframes entry-spin {
          0% { transform: rotateY(-180deg) rotateX(20deg); }
          100% { transform: rotateY(0deg) rotateX(10deg); }
        }

        @keyframes idle-float {
          0%, 100% { transform: translateY(0) rotateX(10deg); }
          50% { transform: translateY(-15px) rotateX(12deg); }
        }

        .orbit-swoosh {
          position: absolute;
          border: 15px solid transparent;
          border-top-color: #38bdf8;
          border-right-color: #0ea5e9;
          border-radius: 50%;
          width: 340px;
          height: 140px;
          transform: rotateX(75deg) rotateZ(-30deg);
          opacity: 0.7;
          filter: blur(1px);
          animation: swoosh-orbit 4s linear infinite;
        }

        @keyframes swoosh-orbit {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(360deg); }
        }

        .letter-pop {
          display: inline-block;
          opacity: 0;
          transform: scale(0.5);
          animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes pop-in {
          to { opacity: 1; transform: scale(1); }
        }

        .shimmer-bg {
          background: linear-gradient(90deg, #fff 0%, #f8fafc 50%, #fff 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .progress-pulse {
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
          animation: progress-glow 1s ease-in-out infinite alternate;
        }
        @keyframes progress-glow {
          from { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
          to { box-shadow: 0 0 25px rgba(14, 165, 233, 0.7); }
        }

        .shield-badge {
          animation: badge-beat 2s ease-in-out infinite;
        }
        @keyframes badge-beat {
          0%, 100% { transform: translateZ(60px) scale(1); }
          50% { transform: translateZ(75px) scale(1.05); }
        }

        .text-seva {
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      <div className="loader-container z-10 flex flex-col items-center">
        <div className="logo-entrance">
          <div className="relative mb-6 flex h-72 w-80 items-center justify-center">
            <div className="orbit-swoosh" />
            
            <div className="logo-3d-motion relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(30px)" }}>
                <div className="relative h-44 w-56 overflow-hidden rounded-[2.5rem] border-t-[8px] border-blue-400 bg-blue-600 shadow-[0_40px_80px_-20px_rgba(18,51,93,0.4)]">
                  <div className="absolute bottom-0 flex h-3/4 w-full items-center justify-center rounded-b-[2rem] border-t border-white/10 bg-[#1e40af]">
                    <span className="text-7xl font-black tracking-tighter text-white" style={{ transform: "translateZ(40px)" }}>DS</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 top-0 flex justify-center" style={{ transform: "translateZ(10px)" }}>
                <div className="shimmer-bg h-52 w-40 space-y-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
                  <div className="h-3 w-full rounded-full bg-blue-500/20" />
                  <div className="h-3 w-full rounded-full bg-blue-500/20" />
                  <div className="h-3 w-4/5 rounded-full bg-blue-500/20" />
                  <div className="h-3 w-full rounded-full bg-blue-500/20" />
                </div>
              </div>

              <div className="shield-badge absolute bottom-8 right-2">
                <div className="flex h-28 w-24 items-center justify-center rounded-[2rem] border-4 border-blue-50 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 shadow-lg">
                    <Check size={32} strokeWidth={4} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="flex items-center justify-center font-black text-6xl tracking-tighter sm:text-8xl">
            {namePart1.split("").map((c, i) => (
              <span key={`p1-${i}`} className="letter-pop text-[#12335d]" style={{ animationDelay: `${0.8 + i * 0.05}s` }}>
                {c}
              </span>
            ))}
            {namePart2.split("").map((c, i) => (
              <span key={`p2-${i}`} className="letter-pop text-seva" style={{ animationDelay: `${1.0 + i * 0.05}s` }}>
                {c}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 opacity-0 transform translate-y-4 transition-all duration-700" style={{ opacity: progress > 50 ? 1 : 0, transform: progress > 50 ? 'translateY(0)' : 'translateY(1rem)' }}>
            Understand. Manage. Stay Ahead.
          </p>
        </div>

        <div className="mt-12 w-80">
          <div className="relative mb-3 h-2 w-full overflow-hidden rounded-full bg-blue-100">
            <div 
              className="progress-pulse h-full bg-gradient-to-r from-blue-900 to-cyan-400 transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/40">
              {status}
            </span>
            <span className="text-[10px] font-black text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

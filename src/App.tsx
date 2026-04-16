import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';
import { Cpu, Zap, Shield, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-bg text-text-main font-sans selection:bg-accent selection:text-bg">
      {/* Header Bar */}
      <header className="px-10 py-6 flex justify-between items-center border-b border-[#222]">
        <div className="text-2xl font-extrabold tracking-[2px] uppercase text-accent neon-text-accent">
          Neon.Snake
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] uppercase text-text-dim tracking-wider">System Status</p>
            <p className="font-mono text-xl text-magenta neon-text-magenta">STABLE</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-text-dim tracking-wider">Network</p>
            <p className="font-mono text-xl text-accent neon-text-accent">ENCRYPTED</p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 px-10 py-8 items-center overflow-hidden">
        {/* Left Panel - Track Library (Music) */}
        <aside className="h-full bg-surface border border-[#222] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#222] text-xs font-bold uppercase text-text-dim flex items-center gap-2">
            <Zap size={14} className="text-accent" /> Track Library
          </div>
          <div className="flex-1 overflow-y-auto">
            <MusicPlayer layout="list" />
          </div>
        </aside>

        {/* Center - Game */}
        <section className="flex flex-col items-center justify-center">
          <SnakeGame />
        </section>

        {/* Right Panel - Game Status */}
        <aside className="h-full bg-surface border border-[#222] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#222] text-xs font-bold uppercase text-text-dim flex items-center gap-2">
            <Shield size={14} className="text-magenta" /> Game Status
          </div>
          <div className="p-5 flex flex-col gap-5 h-full">
            <div className="bg-white/5 p-4 rounded-lg">
              <h5 className="text-[11px] uppercase text-text-dim mb-2">Current Powerup</h5>
              <p className="text-accent text-sm font-bold">Speed Multiplier x2</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h5 className="text-[11px] uppercase text-text-dim mb-2 flex items-center gap-1">
                <Info size={10} /> Controls
              </h5>
              <p className="text-xs text-text-dim leading-relaxed font-mono">
                [W/A/S/D] Move Snake<br />
                [SPACE] Pause Music<br />
                [M] Mute Audio
              </p>
            </div>

            <div className="mt-auto">
              <div className="p-4 border border-dashed border-magenta rounded-lg">
                <p className="text-[10px] text-magenta text-center font-bold tracking-widest">
                  NEXT REWARD IN 250 PTS
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer - Player Controls */}
      <footer className="h-[100px] bg-surface border-t border-[#222] px-10 flex items-center justify-between">
        <MusicPlayer layout="controls" />
      </footer>
    </div>
  );
}

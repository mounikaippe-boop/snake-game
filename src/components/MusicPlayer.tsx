import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  layout?: 'list' | 'controls';
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  progress?: number;
}

// We'll use a simple global-ish state for the audio to keep it synced
let globalAudio: HTMLAudioElement | null = null;

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  layout = 'list',
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!globalAudio) {
      globalAudio = new Audio();
    }

    const audio = globalAudio;

    const handleTimeUpdate = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Sync initial state
    setIsPlaying(!audio.paused);
    // Find current track index from src if possible
    const index = TRACKS.findIndex(t => t.url === audio.src);
    if (index !== -1) setCurrentTrackIndex(index);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    if (globalAudio && globalAudio.src !== currentTrack.url) {
      globalAudio.src = currentTrack.url;
      if (isPlaying) globalAudio.play();
    }
  }, [currentTrackIndex]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (globalAudio) {
      if (isPlaying) {
        globalAudio.pause();
      } else {
        globalAudio.play();
      }
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  if (layout === 'list') {
    return (
      <ul className="list-none">
        {TRACKS.map((track, index) => (
          <li
            key={track.id}
            onClick={() => setCurrentTrackIndex(index)}
            className={`p-4 flex items-center gap-3 border-b border-[#1a1a1c] cursor-pointer transition-colors ${
              currentTrackIndex === index ? 'bg-accent/5 border-l-3 border-accent' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-10 h-10 bg-[#222] rounded flex items-center justify-center text-lg">
              {index === 0 ? '✦' : index === 1 ? '≋' : '◈'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-bold truncate">{track.title}</h4>
              <p className="text-[11px] text-text-dim">AI Music Gen • 3:42</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="flex items-center gap-6">
        <button onClick={prevTrack} className="text-text-main hover:text-accent transition-colors">
          <SkipBack size={20} fill="currentColor" />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-accent text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,204,0.3)]"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-text-main hover:text-accent transition-colors">
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      <div className="flex-1 mx-10 flex flex-col gap-2">
        <div className="flex justify-between font-mono text-[10px] text-text-dim">
          <span>{currentTime}</span>
          <span className="text-text-main uppercase tracking-widest">{currentTrack.title} — Playing Now</span>
          <span>{duration}</span>
        </div>
        <div className="h-1 bg-[#333] rounded-full relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_10px_rgba(0,255,204,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Volume2 size={16} className="text-text-dim" />
        <div className="w-[120px] h-1 bg-[#333] rounded-full overflow-hidden">
          <div className="w-[70%] h-full bg-text-dim rounded-full" />
        </div>
      </div>
    </>
  );
};

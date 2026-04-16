import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON DREAMS',
    artist: 'SYNTH_WAVE_AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'CYBERPUNK_VOID',
    artist: 'GLITCH_BOT',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'PIXEL_HEART',
    artist: '8BIT_REBEL',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/pixel/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 2;

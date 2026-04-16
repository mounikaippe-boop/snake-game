import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { GlitchText } from './GlitchText';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
  };

  const gameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    if (score > highScore) setHighScore(score);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'Enter':
          if (status !== GameStatus.PLAYING) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = '#08080a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    const centerX = food.x * cellSize + cellSize / 2;
    const centerY = food.y * cellSize + cellSize / 2;
    ctx.arc(centerX, centerY, (cellSize / 2) * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffcc';
      ctx.shadowBlur = index === 0 ? 12 : 8;
      ctx.shadowColor = '#00ffcc';
      
      const padding = 1;
      const size = cellSize - padding * 2;
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      
      // Rounded rect for snake
      const radius = index === 0 ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const gameLoop = useCallback((timestamp: number) => {
    if (status === GameStatus.PLAYING) {
      if (timestamp - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [status, speed, moveSnake, draw]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-12 mb-8">
        <div className="text-center">
          <p className="text-[10px] uppercase text-text-dim tracking-widest">Score</p>
          <p className="font-mono text-2xl text-magenta neon-text-magenta">{score.toString().padStart(5, '0')}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-text-dim tracking-widest">Hi-Score</p>
          <p className="font-mono text-2xl text-magenta neon-text-magenta">{highScore.toString().padStart(5, '0')}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-text-dim tracking-widest">Level</p>
          <p className="font-mono text-2xl text-magenta neon-text-magenta">{(Math.floor(score / 100) + 1).toString().padStart(2, '0')}</p>
        </div>
      </div>

      <div className="relative p-0.5 bg-accent/20 border-2 border-accent neon-border-accent shadow-[0_0_30px_rgba(0,255,204,0.1)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full aspect-square bg-black"
        />
        
        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <GlitchText
                text={status === GameStatus.IDLE ? 'NEON.SNAKE' : 'GAME OVER'}
                className="text-4xl font-display font-extrabold text-accent mb-6 tracking-tighter"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-10 py-3 bg-accent text-bg font-bold tracking-[2px] uppercase hover:bg-white transition-colors rounded-sm"
              >
                {status === GameStatus.IDLE ? 'Start Game' : 'Retry'}
              </motion.button>
              <p className="mt-4 font-mono text-[10px] text-text-dim uppercase tracking-[1px]">
                Press ENTER to initialize
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

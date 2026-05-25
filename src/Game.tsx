import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { SnakeScene } from './game/SnakeScene';

export default function Game({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#ffffff', // Putih cerah
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }
        }
      },
      scene: SnakeScene
    };

    const game = new Phaser.Game(config);

    game.events.on('score-update', onScoreUpdate);

    return () => {
      game.events.off('score-update', onScoreUpdate);
      game.destroy(true);
    };
  }, [onScoreUpdate]);

  return <div ref={gameRef} className="w-full h-full" />;
}

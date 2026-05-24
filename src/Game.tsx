import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function Game() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: {
        preload: preload,
        create: create
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Load assets here
    }

    function create() {
      this.add.text(400, 300, 'Phaser 3 + React + Tailwind', {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} className="w-[800px] h-[600px] bg-black" />;
}

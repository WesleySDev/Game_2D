import * as Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87ceeb",
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: [GameScene],
};

new Phaser.Game(config);

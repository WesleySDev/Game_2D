import * as Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { CastleScene } from "./scenes/CastleScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true, gravity: { y: 0 } },
  },
  scene: [GameScene, CastleScene],
});

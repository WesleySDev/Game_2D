import * as Phaser from "phaser";
import { createPlayer, loadSprites } from "./player";
import { createControls, configControls } from "./controls";

export class CastleScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  controls!: Phaser.Types.Input.Keyboard.CursorKeys;
  teleportZone!: Phaser.GameObjects.Zone;

  startX = 50; // posição padrão
  startY = 280;
  constructor() {
    super("CastleScene");
  }

  preload() {
    loadSprites(this);
    this.load.image(
      "castleTiles",
      "/assets/tilesets/tilemap_packed_dungeon.png"
    );
    this.load.tilemapTiledJSON("castle", "/assets/maps/castle.json");
  }

  create() {
    const map = this.make.tilemap({ key: "castle" });
    const tileset = map.addTilesetImage(
      "tilemap_packed_dungeon",
      "castleTiles"
    );

    const ground = map.createLayer("groundCastle", tileset, 0, 0);
    const collider = map.createLayer("colliderCastle", tileset, 0, 0);

    // Configura colisões
    collider?.setCollisionByProperty({ collider: true });

    this.player = createPlayer(this, this.startX, this.startY);
    this.player.anims.play("Player_idle", true);
    // teleport zone
    this.teleportZone = this.add.zone(10 + 25, 300 + 25, 50, 50); // centro x,y, largura, altura
    this.physics.world.enable(this.teleportZone); // habilita física para a zona de teletransporte
    this.teleportZone.body.setAllowGravity(false); // desativa a gravidade para evitar que o player caia
    this.teleportZone.body.setImmovable(true);

    // checar overlap
    this.physics.add.overlap(this.player, this.teleportZone, () => {
      this.scene.start("GameScene", { x: 550, y: 500 });
    });

    this.physics.add.collider(this.player, collider);
    this.physics.add.collider(this.player, ground);

    // Câmera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.controls = createControls(this);
    configControls(this.player, this.controls, this);
  }

  update() {
    configControls(this.player, this.controls, this);
  }
}

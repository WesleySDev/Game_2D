import * as Phaser from "phaser";

export class CastleScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("CastleScene");
  }

  preload() {
    this.load.spritesheet("swordsman1", "/assets/sprites/swordsman1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image(
      "castleTiles",
      "/assets/tilesets/tilemap_packed_dungeon.png"
    );
    this.load.tilemapTiledJSON("castleMap", "/assets/maps/castle.json");
  }

  create() {
    const map = this.make.tilemap({ key: "castleMap" });
    const tileset = map.addTilesetImage("CastleTilesetName", "castleTiles");
    const ground = map.createLayer("LayerNameNoTiled", tileset, 0, 0);

    this.player = this.physics.add.sprite(100, 100, "swordsman1");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    // Voltar para mapa principal
    if (
      this.player.x > 20 &&
      this.player.x < 50 &&
      this.player.y > 20 &&
      this.player.y < 50
    ) {
      this.scene.start("GameScene");
    }
  }
}

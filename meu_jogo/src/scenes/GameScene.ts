import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("GameScene");
  }

  preload() {
    // Sprites e tiles
    this.load.spritesheet("swordsman1", "/assets/sprites/swordsman1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("tiles", "/assets/tilesets/tilemap_packed.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
  }

  create() {
    // Criação do tilemap e tileset
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    const ground = map.createLayer("ground", tileset, 0, 0);
    const collider = map.createLayer("Colliders", tileset, 0, 0);
    const fluterObject = map.createLayer("fluterObject", tileset, 0, 0);

    // Configura colisões
    collider?.setCollisionByProperty({ collider: true });

    // Criação do player
    this.player = this.physics.add.sprite(400, 100, "swordsman1");
    this.player.setCollideWorldBounds(true);
    this.player.setSize(16, 16);
    this.player.body.setOffset(16, 32);

    // Colliders
    this.physics.add.collider(this.player, collider);
    this.physics.add.collider(this.player, ground);

    // Input do teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // Layer de objetos do Tiled
    const objectsLayer = map.getObjectLayer("Objects");
    const portalObj = objectsLayer.objects.find(
      (obj) => obj.name === "targetMap"
    );

    if (portalObj) {
      const portal = this.physics.add
        .sprite(portalObj.x, portalObj.y, "")
        .setOrigin(0, 0)
        .setSize(portalObj.width, portalObj.height)
        .setVisible(false);

      this.physics.add.overlap(this.player, portal, () => {
        this.scene.start("CastleScene", { x: 50, y: 300 });
      });
    }

    // Depth das layers
    ground?.setDepth(0);
    this.player.setDepth(1);
    fluterObject?.setDepth(2);

    // Câmera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // Debug: mostra o corpo do player
    this.player.body.debugShowBody = true;
  }

  update() {
    this.updatePlayerMovement();
  }

  private updatePlayerMovement() {
    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    }

    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown) this.player.setVelocityY(speed);
  }
}

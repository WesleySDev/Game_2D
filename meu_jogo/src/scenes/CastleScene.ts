import * as Phaser from "phaser";

export class CastleScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  startX: number = 100;
  startY: number = 100;

  constructor() {
    super("CastleScene");
  }

  init(data: any) {
    if (data.x !== undefined) this.startX = data.x;
    if (data.y !== undefined) this.startY = data.y;
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

    // Player
    this.player = this.physics.add.sprite(
      this.startX,
      this.startY,
      "swordsman1"
    );
    this.player.setCollideWorldBounds(true);
    this.player.setSize(16, 16);
    this.player.body.setOffset(16, 32);

    this.physics.add.collider(this.player, collider);
    this.physics.add.collider(this.player, ground);

    // Câmera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.updatePlayerMovement();

    // Coordenadas e tamanho do retângulo de transição
    const transitionX = 5;
    const transitionY = 303;
    const transitionWidth = 45;
    const transitionHeight = 30;

    // Checar se o player está dentro do retângulo
    if (
      this.player.x > transitionX &&
      this.player.x < transitionX + transitionWidth &&
      this.player.y > transitionY &&
      this.player.y < transitionY + transitionHeight
    ) {
      this.scene.start("GameScene", { x: 560, y: 490 });
    }
    /* Quadrado de transporte
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 0.5); // vermelho semitransparente
    graphics.fillRect(5, 303, 45, 30); // x, y, largura, altura
    */
  }

  private updatePlayerMovement() {
    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.flipX = false;
    }

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
  }
}

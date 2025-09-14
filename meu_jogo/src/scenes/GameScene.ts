import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("GameScene");
  }

  preload() {
    // Carrega os assets do jogo
    this.load.spritesheet("swordsman1", "./assets/swordsman1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("swordsman2", "./assets/swordsman2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("swordsman3", "./assets/swordsman3.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("tiles", "./assets/medieval_tilesheet.png");
    this.load.tilemapTiledJSON("map", "./assets/map.json");
  }

  create() {
    // Animações
    this.anims.create({
      key: "walk1",
      frames: this.anims.generateFrameNumbers("swordsman1", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk2",
      frames: this.anims.generateFrameNumbers("swordsman2", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk3",
      frames: this.anims.generateFrameNumbers("swordsman3", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Carrega o mapa
    const map = this.make.tilemap({ key: "map" });

    // 🔧 Nome do tileset no Tiled é "assets"
    const tileset = map.addTilesetImage("assets", "tiles");

    // Usa a camada "ground" (nome igual ao Tiled)
    const ground = map.createLayer("ground", tileset, 0, 0);
    ground.setCollisionByProperty({ collides: true });

    // Player (ajustado para tamanho proporcional ao mapa)
    this.player = this.physics.add.sprite(100, 100, "swordsman1");
    this.player.setScale(1); // como o tile é 32x32, reduz o tamanho do player
    this.player.setCollideWorldBounds(true);
    this.player.play("walk1");

    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Faz a câmera seguir o player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
  }

  update() {
    // Movimentação do jogador
    let isMoving = false; // Se o jogador está se movendo

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
      isMoving = true;
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      isMoving = true;
    } else {
      this.player.setVelocityY(0);
    }

    // Trocar animação com base na tecla pressionada
    if (this.cursors.space.isDown) {
      this.player.play("walk3", true);
    } else if (this.cursors.shift.isDown) {
      this.player.play("walk2", true);
    } else if (isMoving) {
      this.player.play("walk1", true);
    } else {
      // Parar a animação quando não estiver se movendo
      this.player.anims.pause();
    }
  }
}

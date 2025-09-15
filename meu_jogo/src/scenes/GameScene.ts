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
    const anims = this.anims;
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("swordsman1", {
        start: 28,
        end: 36,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("swordsman1", {
        start: 19,
        end: 27,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("swordsman1", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("swordsman1", {
        start: 10,
        end: 18,
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
    const fluter = map.createLayer("fluter", tileset, 0, 0);
    fluter?.setDepth(10);

    const objectCollider = map.createLayer("Object", tileset, 0, 0);

    // Player (ajustado para tamanho proporcional ao mapa)

    this.player = this.physics.add.sprite(200, 200, "swordsman1");
    this.player.setScale(0.7); // como o tile é 32x32, reduz o tamanho do player
    this.player.setCollideWorldBounds(true);
    this.player.play(anims);

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, objectCollider);
    objectCollider?.setCollisionByProperty({ colider: true });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Faz a câmera seguir o player
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    // Movimentação do jogador
    let isMoving = false; // Se o jogador está se movendo

    const previousVelocity = this.player.body.velocity.clone();

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
      this.player.play("left", true);
    } else if (this.cursors.shift.isDown) {
      this.player.play("right", true);
    } else if (isMoving) {
      this.player.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.play("down", true);
    } else {
      // Parar a animação quando não estiver se movendo
      this.player.anims.pause();
    }
  }
}

import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super("GameScene");
  }

  preload() {
    // Carrega os assets do jogo
    this.load.image("player", "/assets/player.svg");
    this.load.spritesheet("swordsman1", "/assets/swordsman1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("swordsman2", "/assets/swordsman2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("swordsman3", "/assets/swordsman3.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    // Criar animações para os sprites
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

    // Adicionar o player na tela usando o sprite animado
    this.player = this.physics.add.sprite(400, 300, "swordsman1");
    this.player.setCollideWorldBounds(true);
    this.player.play("walk1");

    // input
    this.cursors = this.input.keyboard.createCursorKeys(); // Criar as teclas de cursor
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

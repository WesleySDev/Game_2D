import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  portals!: Phaser.Physics.Arcade.StaticGroup;
  currentMap: string = "word";

  constructor() {
    super("GameScene");
  }

  preload() {
    // Carrega o mapa e tiles
    this.load.tilemapTiledJSON("word", "./assets/Word.json");
    this.load.image("assets", "./assets/tilemap_packed.png");

    // Carrega os sprites dos personagens
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
  }

  create() {
    // Criação das animações
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

    // Cria o mapa inicial
    this.loadMap(this.currentMap, 5, 5);

    // Teclas
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // carrega o mapa e configura o player
  loadMap(mapKey: string, startX: number, startY: number) {
    // limpa o mapa anterior, se houver
    this.children.removeAll();

    // cria mapa e tiles
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage("assets", "assets");

    const ground = map.createLayer("ground", tileset, 0, 0);
    const fluter = map.createLayer("fluter", tileset, 0, 0);
    ground.setCollisionByProperty({ collider: true });
    fluter.setCollisionByProperty({ collider: true });
    const objectLayer = map.createLayer("Object", tileset, 0, 0);
    const collider = map.createLayer("collider", tileset, 0, 0);

    collider?.setCollisionByProperty({ collider: true });

    // cria o player
    this.player = this.physics.add.sprite(startX, startY, "swordsman1");
    this.player.setScale(0.7);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, collider);

    // cria portais
    this.portals = this.physics.add.staticGroup();
    const portalObjects = map.getObjectLayer("portals")?.objects || [];

    portalObjects.forEach((obj) => {
      const portal = this.portals.create(obj.x!, obj.y!, "");
      portal.setSize(obj.width!, obj.height!);
      (portal as any).portalData = {
        targetMap: obj.properties.find((p) => p.name === "targetMap")?.value,
        targetX: obj.properties.find((p) => p.name === "targetX")?.value,
        targetY: obj.properties.find((p) => p.name === "targetY")?.value,
      };
    });

    this.physics.add.overlap(this.player, this.portals, (_, portal) => {
      const data = (portal as any).portalData;
      this.loadMap(data.targetMap, data.targetX, data.targetY);
    });

    // câmera segue player
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player);
  }

  update() {
    let isMoving = false;

    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
      isMoving = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      isMoving = true;
    }

    if (this.cursors.space.isDown) {
      this.player.play("left", true);
    } else if (this.cursors.shift.isDown) {
      this.player.play("right", true);
    } else if (isMoving) {
      this.player.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.play("down", true);
    } else {
      this.player.anims.pause();
    }
  }
}

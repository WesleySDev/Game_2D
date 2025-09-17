import * as Phaser from "phaser";
import { createPlayer, loadSprites } from "./player";
import { createControls, configControls } from "./controls";
export class GameScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  controls!: Phaser.Types.Input.Keyboard.CursorKeys;

  startX = 200; // posição padrão
  startY = 100;

  init(data: any) {
    // Se veio posição de outra cena, use-a
    if (data.x !== undefined && data.y !== undefined) {
      this.startX = data.x;
      this.startY = data.y;
    }
  }
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("tiles", "/assets/tilesets/tilemap_packed.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
    loadSprites(this);
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    const ground = map.createLayer("ground", tileset, 0, 0);
    const collider = map.createLayer("Colliders", tileset, 0, 0);
    const fluterObject = map.createLayer("fluterObject", tileset, 0, 0);

    // Configura colisões
    collider?.setCollisionByProperty({ collider: true });

    // Criação do player
    this.player = createPlayer(this, this.startX, this.startY);
    this.player.anims.play("Player_idle", true);
    // teleport zone
    this.teleportZone = this.add.zone(535 + 25, 428 + 25, 50, 50); // centro x,y, largura, altura
    this.physics.world.enable(this.teleportZone); // habilita física para a zona de teletransporte
    this.teleportZone.body.setAllowGravity(false); // desativa a gravidade para evitar que o player caia
    this.teleportZone.body.setImmovable(true);

    // checar overlap
    this.physics.add.overlap(this.player, this.teleportZone, () => {
      this.scene.start("CastleScene", { x: 100, y: 200 });
    });

    this.physics.add.collider(this.player, collider);
    this.physics.add.collider(this.player, ground);

    // Depth das layers
    ground.setDepth(0);
    this.player.setDepth(1);
    fluterObject.setDepth(2);

    // Câmera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.controls = createControls(this);
  }

  update() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 0.5); // vermelho semitransparente
    graphics.fillRect(535, 428, 50, 50); // x, y, largura, altura

    configControls(this.player, this.controls, this);
  }
}

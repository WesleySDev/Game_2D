export const createPlayer = (scene: Phaser.Scene, x: number, y: number) => {
  const player = scene.physics.add.sprite(x, y, "Player_idle");

  (player as any).lastDirection = "down";
  (player as any).isAttacking = false;
  createAnimations(scene);
  return player;
};

export const loadSprites = (scene: Phaser.Scene): void => {
  scene.load.spritesheet("Player_idle", "/assets/sprites/Player.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("Player_walk", "/assets/sprites/Player.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("Player_attack", "/assets/sprites/Player.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
};
export const createAnimations = (scene: Phaser.Scene): void => {
  scene.anims.create({
    key: "Player_idle",
    frames: scene.anims.generateFrameNumbers("Player_idle", {
      start: 0,
      end: 5,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  //animção andando para direita
  scene.anims.create({
    key: "Player_walk_right",
    frames: scene.anims.generateFrameNumbers("Player_walk", {
      start: 24,
      end: 29,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  //animção andando para esquerda
  scene.anims.create({
    key: "Player_walk_left",
    frames: scene.anims.generateFrameNumbers("Player_walk", {
      start: 24,
      end: 29,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  //animção andando para cima
  scene.anims.create({
    key: "Player_walk_up",
    frames: scene.anims.generateFrameNumbers("Player_walk", {
      start: 30,
      end: 35,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  //animção andando para baixo
  scene.anims.create({
    key: "Player_walk_down",
    frames: scene.anims.generateFrameNumbers("Player_walk", {
      start: 18,
      end: 23,
    }),
    frameRate: 7,
    repeat: -1,
    yoyo: true,
  });
  //animção ataque para direita
  scene.anims.create({
    key: "Player_attack_right",
    frames: scene.anims.generateFrameNumbers("Player_attack", {
      start: 41,
      end: 44,
    }),
    frameRate: 12,
    repeat: 0,
  });
  //animção ataque para esquerda
  scene.anims.create({
    key: "Player_attack_left",
    frames: scene.anims.generateFrameNumbers("Player_attack", {
      start: 42,
      end: 47,
    }),
    frameRate: 12,
    repeat: 0,
  });
  //animção ataque para cima
  scene.anims.create({
    key: "Player_attack_up",
    frames: scene.anims.generateFrameNumbers("Player_attack", {
      start: 48,
      end: 53,
    }),
    frameRate: 12,
    repeat: 0,
  });
  //animção ataque para baixo
  scene.anims.create({
    key: "Player_attack_down",
    frames: scene.anims.generateFrameNumbers("Player_attack", {
      start: 37,
      end: 40,
    }),
    frameRate: 12,
    repeat: 0,
  });
};

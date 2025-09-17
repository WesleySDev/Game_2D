export const createControls = (
  scene: Phaser.Scene
): Phaser.Types.Input.Keyboard.CursorKeys => {
  return {
    cursors: scene.input.keyboard.createCursorKeys(),
  };
};

export const configControls = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  controls: Phaser.Types.Input.Keyboard.CursorKeys
): void => {
  // se está atacando, não aceita movimento
  if ((player as any).isAttacking) {
    player.setVelocity(0);
    return;
  }

  player.setVelocityX(0);
  player.setVelocityY(0);

  // Ataque primeiro
  if (
    Phaser.Input.Keyboard.JustDown(controls.cursors.space) &&
    !(player as any).isAttacking
  ) {
    (player as any).isAttacking = true; // 👈 agora realmente entra em ataque
    player.setVelocity(0); // para imediatamente

    const dir = (player as any).lastDirection || "down";
    switch (dir) {
      case "right":
        attackRight(player);
        break;
      case "left":
        attackLeft(player);
        break;
      case "up":
        attackUp(player);
        break;
      case "down":
      default:
        attackDown(player);
        break;
    }

    // libera depois que animação terminar
    player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      (player as any).isAttacking = false;
    });
    return; // não processa movimento nesse frame
  }

  // Movimento normal
  if (controls.cursors.right?.isDown) {
    moveRight(player);
  } else if (controls.cursors.left?.isDown) {
    moveLeft(player);
  } else if (controls.cursors.up?.isDown) {
    moveUp(player);
  } else if (controls.cursors.down?.isDown) {
    moveDown(player);
  } else {
    player.anims.play("Player_idle", true);
  }
};

const defaultVelocity = 160;

const moveRight = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.setFlipX(false);
  player.anims.play("Player_walk_right", true);
  player.setVelocityX(defaultVelocity);
  (player as any).lastDirection = "right"; // 👈 atualiza direção
};

const moveLeft = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.setFlipX(true);
  player.anims.play("Player_walk_left", true);
  player.setVelocityX(-defaultVelocity);
  (player as any).lastDirection = "left"; // 👈
};

const moveUp = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.setVelocityY(-defaultVelocity);
  player.anims.play("Player_walk_up", true);
  player.setFlipY(false);
  (player as any).lastDirection = "up"; // 👈
};

const moveDown = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.setVelocityY(defaultVelocity);
  player.anims.play("Player_walk_down", true);
  player.setFlipY(false);
  (player as any).lastDirection = "down"; // 👈
};

const attackRight = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.anims.play("Player_attack_right", true);
};
const attackLeft = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.anims.play("Player_attack_left", true);
};
const attackUp = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.anims.play("Player_attack_up", true);
};
const attackDown = (
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
): void => {
  player.anims.play("Player_attack_down", true);
};

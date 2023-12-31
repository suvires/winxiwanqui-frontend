// TODO: que no puedas ponerte encima de otro jugador

import Phaser from 'phaser'
import { ANIMATIONS, DIRECTIONS } from '../../config/constants'

export default class PlayerCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)

    this.setOrigin(0, 0)
    this.setCollideWorldBounds(true)
    this.setDepth(1)

    this.isMoving = false
    this.isAutoMoving = false
    this.lastDirection = null
    this.inRoom = false
  }

  isInRoom () {
    const roomLayer = this.scene.map.getLayer(1).tilemapLayer
    const tile = roomLayer.getTileAtWorldXY(this.x, this.y, true)
    return tile && tile.index === 2
  }

  updateRoomStatus () {
    const isCurrentlyInRoom = this.isInRoom()

    if (isCurrentlyInRoom && !this.inRoom) {
      this.onEnterRoom()
    } else if (!isCurrentlyInRoom && this.inRoom) {
      this.onExitRoom()
    }

    this.inRoom = isCurrentlyInRoom
  }

  createAutoMoveTween (newX, newY) {
    return {
      targets: this,
      x: { value: newX, duration: 200 },
      y: { value: newY, duration: 200 },
      onStart: () => {
        this.emitPosition()
        this.isAutoMoving = true
        this.autoMoveTo(newX, newY)
      },
      onUpdate: () => {
        this.updateRoomStatus()
      },
      onComplete: () => {
        this.emitPosition()
      }
    }
  }

  startAutoMove (path) {
    if (this.isMoving) return
    this.scene.tweens.killTweensOf(this)

    const tweens = path.slice(0, -1).map((point, i) => {
      const newX = path[i + 1].x * this.scene.map.tileWidth
      const newY = path[i + 1].y * this.scene.map.tileHeight
      return this.createAutoMoveTween(newX, newY)
    })

    this.scene.tweens.chain({
      tweens,
      onComplete: () => {
        this.anims.stop()
        this.isAutoMoving = false
      }
    })
  }

  playAnimation (direction) {
    let animationKey
    switch (direction) {
      case DIRECTIONS.LEFT:
        animationKey = ANIMATIONS.LEFT_WALK
        break
      case DIRECTIONS.RIGHT:
        animationKey = ANIMATIONS.RIGHT_WALK
        break
      case DIRECTIONS.UP:
        animationKey = ANIMATIONS.UP_WALK
        break
      case DIRECTIONS.DOWN:
        animationKey = ANIMATIONS.DOWN_WALK
        break
    }
    this.anims.play(`${this.texture.key}-${animationKey}`, true)
  }

  move (direction) {
    if (this.isMoving) return

    let newX = this.x
    let newY = this.y

    switch (direction) {
      case DIRECTIONS.LEFT:
        newX -= this.scene.map.tileWidth
        break
      case DIRECTIONS.RIGHT:
        newX += this.scene.map.tileWidth
        break
      case DIRECTIONS.UP:
        newY -= this.scene.map.tileHeight
        break
      case DIRECTIONS.DOWN:
        newY += this.scene.map.tileHeight
        break
    }

    this.moveTo(newX, newY)
  }

  determineDirection (newX, newY) {
    const dx = newX - this.x
    const dy = newY - this.y

    const direction = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
      : (dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP)

    this.lastDirection = direction
    return direction
  }

  moveTo (newX, newY, otherPlayer = false) {
    const direction = this.determineDirection(newX, newY)

    this.scene.tweens.killTweensOf(this)
    this.playAnimation(direction)
    this.isMoving = true

    const tweenConfig = {
      targets: this,
      x: newX,
      y: newY,
      duration: 200,
      onComplete: () => {
        if (!otherPlayer) {
          this.emitPosition()
          this.updateRoomStatus()
        }
        this.isMoving = false
        this.anims.stop()
      }
    }

    this.scene.tweens.add(tweenConfig)
  }

  onEnterRoom () {
    if (this.scene.onEnterRoom) {
      this.scene.onEnterRoom()
    }
  }

  onExitRoom () {
    if (this.scene.onExitRoom) {
      this.scene.onExitRoom()
    }
  }

  autoMoveTo (newX, newY) {
    const direction = this.determineDirection(newX, newY)
    this.playAnimation(direction)
  }

  stop () {
    this.isAutoMoving = false
    this.isMoving = false
    this.setVelocity(0)
    this.anims.stop()
  }

  update (cursors) {
    if (this.isAutoMoving || this.isMoving) return

    if (cursors.left.isDown) {
      this.move(DIRECTIONS.LEFT)
    } else if (cursors.right.isDown) {
      this.move(DIRECTIONS.RIGHT)
    } else if (cursors.down.isDown) {
      this.move(DIRECTIONS.DOWN)
    } else if (cursors.up.isDown) {
      this.move(DIRECTIONS.UP)
    } else {
      this.stop()
    }
  }

  emitPosition () {
    this.scene.socketManager.emit('movePlayer', {
      userId: this.scene.user.id,
      positionX: this.x,
      positionY: this.y,
      lastDirection: this.lastDirection
    })
  }
}

import Phaser from 'phaser'
import PlayerCharacter from './PlayerCharacter'
import PathfindingManager from './PathfindingManager'
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, CHARACTERS_SPRITES, PLAYER_ANIMATIONS, DIRECTIONS, IDLE_FRAMES } from '../../config/constants'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('GameScene')
  }

  isCollision = (x, y) => {
    const tile = this.map.getTileAt(x, y, false, 0)
    return tile ? tile.properties.collide === true : false
  }

  handleClick = (pointer) => {
    const x = this.camera.scrollX + pointer.x
    const y = this.camera.scrollY + pointer.y
    const toX = Math.floor(x / TILE_SIZE)
    const toY = Math.floor(y / TILE_SIZE)
    const fromX = Math.floor(this.player.x / TILE_SIZE)
    const fromY = Math.floor(this.player.y / TILE_SIZE)

    this.pathfindingManager.calculatePath(fromX, fromY, toX, toY, path => {
      this.player.startAutoMove(path)
    })
  }

  createMarker () {
    this.marker = this.add.graphics()
    this.marker.lineStyle(3, 0xffffff, 1)
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight)
  }

  updateMarker () {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main)
    const pointerTileX = this.map.worldToTileX(worldPoint.x)
    const pointerTileY = this.map.worldToTileY(worldPoint.y)
    this.marker.x = this.map.tileToWorldX(pointerTileX)
    this.marker.y = this.map.tileToWorldY(pointerTileY)
    this.marker.setVisible(!this.isCollision(pointerTileX, pointerTileY))
  }

  init (data) {
    this.socketManager = data.socketManager
    this.user = data.user
    this.otherPlayers = data.otherPlayers
    switch (this.user.name) {
      case 'Suvi':
        this.user.characterSprite = 'bird'
        break
      case 'Pat':
        this.user.characterSprite = 'cat'
        break
      case 'Ru':
        this.user.characterSprite = 'fox'
        break
      default:
        this.user.characterSprite = 'racoon'
    }
    this.onEnterRoom = data.onEnterRoom
    this.onExitRoom = data.onExitRoom
  }

  preload () {
    this.load.image('base_tiles', 'assets/base_tiles.png')
    this.load.image('default_tiles', 'assets/default_tiles.png')
    this.load.tilemapTiledJSON('map', 'assets/base_tiles.json')

    this.load.spritesheet('fox', 'assets/fox.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
    this.load.spritesheet('cat', 'assets/cat.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
    this.load.spritesheet('racoon', 'assets/racoon.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
  }

  createAnimations () {
    for (const sprite of CHARACTERS_SPRITES) {
      for (const [key, anim] of Object.entries(PLAYER_ANIMATIONS)) {
        this.anims.create({
          key: sprite + '-' + key,
          frames: this.anims.generateFrameNumbers(sprite, anim),
          frameRate: anim.frameRate,
          repeat: anim.repeat
        })
      }
    }
  }

  createMap () {
    const map = this.make.tilemap({ key: 'map' })
    const groundTileset = map.addTilesetImage('standard_tiles', 'base_tiles')
    const roomTileset = map.addTilesetImage('default_tiles', 'default_tiles')

    map.createLayer(0, groundTileset, 0, 0)
    map.createLayer(1, roomTileset, 0, 0)

    return map
  }

  createPlayer (x, y, characterSprite, lastDirection = DIRECTIONS.DOWN) {
    const frame = IDLE_FRAMES[lastDirection]
    const player = new PlayerCharacter(this, x, y, characterSprite, frame)
    player.onEnterRoom = this.onEnterRoom
    player.onExitRoom = this.onExitRoom
    return player
  }

  createPathfindingManager (map) {
    const groundTileset = map.tilesets.find(t => t.name === 'standard_tiles')
    return new PathfindingManager(map, groundTileset)
  }

  handlePlayerCreated = (playerData) => {
    if (playerData.userId !== this.user.id) {
      const x = playerData.positionX
      const y = playerData.positionY
      const characterSprite = playerData.characterSprite
      const lastDirection = playerData.lastDirection
      const otherPlayer = this.createPlayer(x, y, characterSprite, lastDirection)
      this.otherPlayers[playerData.userId] = otherPlayer
    }
  }

  handlePlayerMoved = (data) => {
    const { userId, positionX, positionY } = data
    if (this.otherPlayers[userId]) {
      const otherPlayer = this.otherPlayers[userId]
      otherPlayer.moveTo(positionX, positionY, true)
    }
  }

  handlePlayerDisconnected = (userId) => {
    if (this.otherPlayers[userId]) {
      this.otherPlayers[userId].destroy()
      delete this.otherPlayers[userId]
    }
  }

  loadOtherPlayers (players) {
    players.forEach(playerData => {
      if (playerData.userId !== this.user.id) {
        const x = playerData.positionX
        const y = playerData.positionY
        const characterSprite = playerData.characterSprite
        const lastDirection = playerData.lastDirection
        const otherPlayer = this.createPlayer(x, y, characterSprite, lastDirection)
        this.otherPlayers[playerData.userId] = otherPlayer
      }
    })
  }

  create () {
    this.input.on('pointerup', this.handleClick)

    this.map = this.createMap()

    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)

    this.player = this.createPlayer(10 * TILE_SIZE, 10 * TILE_SIZE, this.user.characterSprite)
    this.socketManager.emit('createPlayer', { userId: this.user.id, characterSprite: this.player.texture.key, positionX: this.player.x, positionY: this.player.y })

    this.loadOtherPlayers(this.otherPlayers)

    this.camera = this.cameras.main
    this.camera.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE)
    this.camera.startFollow(this.player)

    this.createAnimations()

    this.pathfindingManager = this.createPathfindingManager(this.map)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.socketManager.onPlayerDisconnected(this.handlePlayerDisconnected)
    this.socketManager.onPlayerCreated(this.handlePlayerCreated)
    this.socketManager.onPlayerMoved(this.handlePlayerMoved)
    this.createMarker()
  }

  update () {
    this.updateMarker()

    if ((this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) && this.player.isAutoMoving) {
      this.tweens.killTweensOf(this.player)
      this.player.isAutoMoving = false
    }
    if (!this.player.isAutoMoving) {
      this.player.update(this.cursors)
    }
  }
}

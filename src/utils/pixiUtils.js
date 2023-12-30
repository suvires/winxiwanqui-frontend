import * as PIXI from 'pixi.js'

export const drawAvatar = ({ avatarImage, position }) => {
  // const avatar = PIXI.Sprite.from(avatarImage)
  // avatar.x = position.x
  // avatar.y = position.y
  // avatar.anchor.set(0.5)
  // return avatar

  PIXI.Assets.load('https://pixijs.com/assets/spritesheet/0123456789.json').then((spritesheet) => {
    // create an array to store the textures
    const textures = []
    let i

    for (i = 0; i < 10; i++) {
      const framekey = `0123456789 ${i}.ase`
      const texture = PIXI.Texture.from(framekey)
      const time = spritesheet.data.frames[framekey].duration

      textures.push({ texture, time })
    }

    const scaling = 4

    // create a slow AnimatedSprite
    const slow = new PIXI.AnimatedSprite(textures)

    slow.anchor.set(0.5)
    slow.scale.set(scaling)
    slow.animationSpeed = 0.5
    slow.x = position.x
    slow.y = position.y
    slow.play()
    return slow
  })
}

export const drawRoom = ({ x, y, width, height }) => {
  const room = new PIXI.Graphics()
  room.beginFill(0x66CCFF)
  room.drawRect(x, y, width, height)
  room.endFill()
  return room
}

export const isAvatarInRoom = ({ position, room }) => {
  const roomBounds = room.getBounds()
  return (
    position.x >= roomBounds.x &&
    position.x <= roomBounds.x + roomBounds.width &&
    position.y >= roomBounds.y &&
    position.y <= roomBounds.y + roomBounds.height
  )
}

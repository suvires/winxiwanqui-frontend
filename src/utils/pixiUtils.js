import * as PIXI from 'pixi.js'

export const drawAvatar = ({ avatarImage, position }) => {
  const avatar = PIXI.Sprite.from(avatarImage)
  avatar.x = position.x
  avatar.y = position.y
  avatar.anchor.set(0.5)
  return avatar
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

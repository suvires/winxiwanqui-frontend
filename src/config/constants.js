export const DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
}

export const ANIMATIONS = {
  LEFT_WALK: 'left-walk',
  RIGHT_WALK: 'right-walk',
  UP_WALK: 'up-walk',
  DOWN_WALK: 'down-walk'
}

export const TILE_SIZE = 32
export const MAP_WIDTH = 100
export const MAP_HEIGHT = 100

export const CHARACTERS_SPRITES = ['fox', 'racoon', 'cat', 'bird']

export const IDLE_FRAMES = {
  [DIRECTIONS.DONW]: 0,
  [DIRECTIONS.RIGHT]: 1,
  [DIRECTIONS.UP]: 2,
  [DIRECTIONS.LEFT]: 3
}

export const PLAYER_ANIMATIONS = {
  [ANIMATIONS.LEFT_WALK]: {
    start: 12,
    end: 19,
    frameRate: 24,
    repeat: -1
  },
  [ANIMATIONS.RIGHT_WALK]: {
    start: 20,
    end: 27,
    frameRate: 24,
    repeat: -1
  },
  [ANIMATIONS.UP_WALK]: {
    start: 28,
    end: 35,
    frameRate: 24,
    repeat: -1
  },
  [ANIMATIONS.DOWN_WALK]: {
    start: 4,
    end: 11,
    frameRate: 24,
    repeat: -1
  }
}

import { drawAvatar } from './pixiUtils'

export const createAvatar = async (user, avatarImage, position) => {
  const newUser = {
    name: user.name,
    id: user.id,
    position
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/avatars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: newUser
      })
    })

    if (response.ok) {
      return drawAvatar({ avatarImage, position })
    } else {
      console.error('Error creating avatar')
    }
  } catch (error) {
    console.error('Fetching error on create avatar', error)
  }
}

export const getAvatars = async (app) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/avatars`)
    if (response.ok) {
      return response.json()
    } else {
      console.error('Error fetching avatars')
    }
  } catch (error) {
    console.error('Error loading avatars:', error)
  }
}

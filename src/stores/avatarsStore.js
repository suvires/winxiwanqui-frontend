import { create } from 'zustand'

export const useAvatarsStore = create(set => ({
  avatars: {},
  setAvatars: (newAvatars) => set({ avatars: newAvatars }),
  addAvatar: (id, avatar) => set(state => ({
    otherUsers: { ...state.avatars, [id]: avatar }
  })),
  updateAvatarsPosition: (id, position) => set(state => ({
    avatars: { ...state.avatars, [id]: { ...state.avatars[id], position } }
  })),
  removeAvatar: (id) => set(state => {
    const avatars = { ...state.avatars }
    delete avatars[id]
    return { avatars }
  })
}))

import { create } from 'zustand'

export const useUserStore = create(set => ({
  user: { name: '', id: '' },
  setUser: (newUser) => set({ user: newUser })
}))

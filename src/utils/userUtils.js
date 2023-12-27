export const generateUniqueId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9)
}

export const getPlayers = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/players`)
    if (response.ok) {
      return response.json()
    } else {
      console.error('Error fetching players')
    }
  } catch (error) {
    console.error('Error loading players:', error)
  }
}

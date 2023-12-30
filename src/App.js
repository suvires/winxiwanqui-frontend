import React, { useEffect } from 'react'
import logo from './assets/images/logo.svg'
import './App.css'
// import Metaverse from './components/Metaverse/Metaverse'
import PhaserGame from './components/PhaserGame/PhaserGame'
import { useUserStore } from './stores/userStore'
import { generateUniqueId } from './utils/userUtils'

function App () {
  const { user, setUser } = useUserStore(state => state)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (storedUser && storedUser.name && storedUser.id) {
      setUser(storedUser)
    } else {
      inputUserName()
    }
  }, [])

  const inputUserName = () => {
    let userName = prompt('Name:', '')
    if (!userName) {
      userName = 'User_' + Math.random().toString(36).substr(2, 5)
    }

    const userId = generateUniqueId()
    const newUser = { name: userName, id: userId }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  if (!user.name) {
    return null
  }

  return (
    <div id="app">
      <aside id="app-sidebar">
        <img src={logo} className="app-logo" alt="logo" />
      </aside>
      <PhaserGame />
    </div>
  )
}

export default App

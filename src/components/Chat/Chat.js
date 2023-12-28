import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './Chat.css'
import { useUserStore } from '../../stores/userStore'

const socket = io(process.env.REACT_APP_SERVER_URL)

function Chat () {
  const { user } = useUserStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('messageReceived', (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      socket.off('messageReceived')
    }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    const messageWithUserName = { userName: user.name, message }
    socket.emit('sendMessage', messageWithUserName)
    setMessage('')
  }

  return (
    <div className="chat-wrapper">
      <main className="chat">
      {messages.map((m, index) => (
        <div key={index} className={m.userName === user.name ? 'me' : ''}>
          <span className="username">{m.userName}: </span>{m.message}
        </div>
      ))}
      </main>
      <footer>
        <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Chat here!"
        />
        <button>Send</button>
        </form>
      </footer>
    </div>
  )
}

export default Chat

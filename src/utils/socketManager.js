import io from 'socket.io-client'

export default class SocketManager {
  constructor (url) {
    this.socket = io(url)
    this.setupListeners()
  }

  setupListeners () {
    this.socket.on('connect', () => {
      console.log('Connected to the server!')
    })

    // this.socket.on('customEvent', (data) => {
    // Handle event 'customEvent'
    // })
  }

  emit (event, data) {
    this.socket.emit(event, data)
  }

  disconnect () {
    this.socket.disconnect()
  }

  onCurrentPlayers (callback) {
    this.socket.on('currentPlayers', callback)
  }

  onPlayerCreated (callback) {
    this.socket.on('playerCreated', callback)
  }

  onPlayerMoved (callback) {
    this.socket.on('playerMoved', callback)
  }

  onPlayerDisconnected (callback) {
    this.socket.on('playerDisconnected', callback)
  }
}

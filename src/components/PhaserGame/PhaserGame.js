import { useEffect, useState, useRef } from 'react'
import Phaser from 'phaser'
import GameScene from './GameScene'
import { useUserStore } from '../../stores/userStore'
import { getPlayers } from '../../utils/serverUtils'
import SocketManager from '../../utils/socketManager'
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from '../../config/const'
import Room from '../Room/Room'
import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from '@100mslive/react-sdk'

const PhaserGame = () => {
  const { user } = useUserStore()
  const [otherPlayers, setOtherPlayers] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [inRoom, setInRoom] = useState(false)
  const refSocketManager = useRef(null)
  const refGame = useRef(null)
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const hmsActions = useHMSActions()

  const config = {
    type: Phaser.AUTO,
    width: MAP_WIDTH * TILE_SIZE,
    height: MAP_HEIGHT * TILE_SIZE,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    parent: 'game-container',
    scene: [GameScene]
  }

  const fetchPlayers = async () => {
    const players = await getPlayers()
    setOtherPlayers(players)
    setLoaded(true)
  }

  const handlePlayerEnteredRoom = () => {
    setInRoom(true)
  }

  const handlePlayerExitedRoom = () => {
    setInRoom(false)
  }

  useEffect(() => {
    fetchPlayers()

    refSocketManager.current = new SocketManager(process.env.REACT_APP_SERVER_URL)

    return () => {
      refSocketManager.current?.disconnect()
      refGame.current?.destroy(true)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      refGame.current = new Phaser.Game(config)
      refGame.current.scene.start('GameScene', {
        user,
        socketManager: refSocketManager.current,
        onEnterRoom: handlePlayerEnteredRoom,
        onExitRoom: handlePlayerExitedRoom,
        otherPlayers
      })
    }
  }, [loaded, otherPlayers, user])

  useEffect(() => {
    if (!inRoom && isConnected) {
      hmsActions.leave()
    }
  }, [inRoom, isConnected])

  if (!loaded) {
    return (
    <div>
      <h1>Loading...</h1>
    </div>
    )
  }
  return (
    <>
      <div id="game-container" />
      {inRoom && <Room />}
    </>
  )
}

export default PhaserGame

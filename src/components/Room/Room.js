import './Room.css'
import Conference from './Conference'
import ControlBar from './ControlBar'
import Chat from '../Chat/Chat'
import { useUserStore } from '../../stores/userStore'
import { useEffect } from 'react'
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk'

const Room = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const hmsActions = useHMSActions()
  const { user } = useUserStore()
  const roomCode = 'sgp-wlhi-zln'

  const joinInToRoom = async (e) => {
    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode })

    try {
      await hmsActions.join({ userName: user.name, authToken })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    joinInToRoom()
  }, [])

  return (
      <>
          {isConnected && (
            <>
              <Conference />
              <ControlBar />
            </>
          ) }
          <Chat />
      </>
  )
}

export default Room

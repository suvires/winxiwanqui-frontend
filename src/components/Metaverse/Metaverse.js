import React, { useEffect, useRef, useState } from 'react'
import * as PIXI from 'pixi.js'
import io from 'socket.io-client'
import _ from 'lodash'
import { useUserStore } from '../../stores/userStore'
import { useAvatarsStore } from '../../stores/avatarsStore'
import { drawAvatar, drawRoom, isAvatarInRoom } from '../../utils/pixiUtils'
import { createAvatar, getAvatars, updateAvatarPosition } from '../../utils/serverUtils'
import Room from '../Room/Room'
import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from '@100mslive/react-sdk'
import avatarImageSuvi from '../../assets/avatars/avatarSuvi.gif'
import avatarImageMA from '../../assets/avatars/avatarMA.gif'
import './Metaverse.css'

const Metaverse = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const hmsActions = useHMSActions()
  const { user } = useUserStore()
  const { addAvatar, removeAvatar } = useAvatarsStore()
  const metaverseContainerRef = useRef(null)
  const currentAvatarRef = useRef(null)
  const avatarsRefs = useRef([])
  const roomRef = useRef([])
  const [isInRoom, setIsInRoom] = useState(false)
  const initialX = 100
  const initialY = 100
  let targetX = initialX
  let targetY = initialY

  const socket = io(process.env.REACT_APP_SERVER_URL)
  socket.on('connect', () => {
    socket.emit('setUserId', user.id)
  })

  const handleStageClick = (event) => {
    const rect = metaverseContainerRef.current.getBoundingClientRect()
    targetX = event.clientX - rect.left
    targetY = event.clientY - rect.top
  }

  const throttledUpdateAvatarPosition = _.throttle(updateAvatarPosition, 5)

  const moveAvatar = () => {
    if (!currentAvatarRef.current) return

    const dx = targetX - currentAvatarRef.current.x
    const dy = targetY - currentAvatarRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const speed = 10

    if (distance < speed) {
      currentAvatarRef.current.x = targetX
      currentAvatarRef.current.y = targetY
      if (isAvatarInRoom({ position: currentAvatarRef.current.position, room: roomRef.current })) {
        setIsInRoom(true)
      } else {
        setIsInRoom(false)
      }
      return
    }

    const normalizedDx = dx / distance
    const normalizedDy = dy / distance

    currentAvatarRef.current.x += normalizedDx * speed
    currentAvatarRef.current.y += normalizedDy * speed

    throttledUpdateAvatarPosition(user.id, currentAvatarRef.current.position)
  }

  useEffect(() => {
    const metaverseContainerElement = document.getElementById('metaverse-container')

    const app = new PIXI.Application({
      backgroundColor: 0x1099bb,
      width: metaverseContainerElement.innerWidth,
      height: metaverseContainerElement.innerHeight,
      resizeTo: metaverseContainerElement
    })

    metaverseContainerRef.current.appendChild(app.view)

    const room = drawRoom({ x: 300, y: 200, width: 200, height: 200 })
    app.stage.addChild(room)
    roomRef.current = room

    const avatarImage = user.name === 'Suvi' ? avatarImageSuvi : avatarImageMA
    createAvatar(user, avatarImage, { x: initialX, y: initialY })
      .then((createdAvatar) => {
        app.stage.addChild(createdAvatar)
        currentAvatarRef.current = createdAvatar
      })
      .catch((error) => {
        console.error('Error setting up avatar:', error)
      })

    app.view.addEventListener('click', handleStageClick)

    getAvatars().then((avatars) => {
      avatars.forEach(avatar => {
        if (avatar.id !== user.id) {
          addAvatar(avatar.id, avatar.position)
          const avatarImage = avatar.name === 'Suvi' ? avatarImageSuvi : avatarImageMA
          const drawedAvatar = drawAvatar({ avatarImage, position: avatar.position })
          app.stage.addChild(drawedAvatar)
          avatarsRefs.current[avatar.id] = drawedAvatar
        }
      })
    })

    app.ticker.add(() => {
      moveAvatar()
    })

    socket.on('avatarCreated', (avatar) => {
      if (avatar.id !== user.id) {
        addAvatar(avatar.id, avatar.position)
        const avatarImage = avatar.name === 'Suvi' ? avatarImageSuvi : avatarImageMA
        const createdAvatar = drawAvatar({ avatarImage, position: avatar.position })
        app.stage.addChild(createdAvatar)
        avatarsRefs.current[avatar.id] = createdAvatar
      }
    })

    socket.on('avatarMoved', (avatar) => {
      if (avatar.id !== user.id) {
        avatarsRefs.current[avatar.id].x = avatar.position.x
        avatarsRefs.current[avatar.id].y = avatar.position.y
      }
    })

    socket.on('avatarRemoved', (avatarId) => {
      removeAvatar(avatarId)
      const removedAvatar = avatarsRefs.current[avatarId]
      if (removedAvatar.parent) {
        removedAvatar.parent.removeChild(removedAvatar)
        removedAvatar.destroy()
      }
      delete avatarsRefs.current[avatarId]
    })

    return () => {
      app.view.removeEventListener('click', handleStageClick)
      app.ticker.remove(moveAvatar)
      app.destroy()
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isInRoom && isConnected) {
      hmsActions.leave()
    }
  }, [isInRoom, isConnected])

  return (
    <>
      <div ref={metaverseContainerRef} id="metaverse-container" />
      {isInRoom && (<Room />)}
    </>
  )
}

export default Metaverse

import { useState } from 'react'
import {
  useAVToggle,
  useScreenShare
} from '@100mslive/react-sdk'
import './ControlBar.css'

const ControlBar = () => {
  const apiUrl = 'https://api.100ms.live'
  const roomId = '6586b8fe3412d193e842030a'
  const meetingUrl = `https://miguelngel-webinar-1123.app.100ms.live/preview/${roomId}/broadcaster?skip_preview=true`
  const mangementToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MDQwMjQyMzgsImV4cCI6MTcwNDExMDYzOCwianRpIjoiand0X25vbmNlIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3MDQwMjQyMzgsImFjY2Vzc19rZXkiOiI2NTg2YjQ2ZDkyOTYxM2FkNTdiNjUwYjAifQ.Sd8PHe8cu6RrgQM0IMGoutohxP0WOpsoDO3K_8MZTOc'

  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo
  } = useAVToggle()

  const {
    amIScreenSharing,
    toggleScreenShare
  } = useScreenShare()

  const [isRecording, setIsRecording] = useState(false)

  const startRecording = async () => {
    try {
      const response = await fetch(`${apiUrl}/v2/recordings/room/${roomId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mangementToken}`
        },
        body: JSON.stringify({
          meeting_url: meetingUrl,
          resolution: { width: 1280, height: 720 }
        })
      })
      const data = await response.json()
      console.log(data)
      setIsRecording(data.isRecording)
    } catch (error) {
      console.error('Error startign recording:', error)
    }
  }

  const stopRecording = async () => {
    try {
      const response = await fetch(`${apiUrl}/v2/recordings/room/${roomId}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mangementToken}`
        }
      })
      const data = await response.json()
      console.log(data)
      setIsRecording(data.isRecording)
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }
  return (
    <div className="control-bar">
      <button className="btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
      </button>
      <button className="btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? 'Disable webcam' : 'Enable webcam'}
      </button>
      <button className="btn-control" onClick={toggleScreenShare}>
      {amIScreenSharing ? 'Stop share screen' : 'Share screen'}
      </button>
      <button className="btn-control" onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button className="btn-control" onClick={stopRecording}>
        Stop Recording
      </button>
    </div>
  )
}

export default ControlBar

import {
  useAVToggle,
  useScreenShare
} from '@100mslive/react-sdk'
import './ControlBar.css'

const ControlBar = () => {
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
    </div>
  )
}

export default ControlBar

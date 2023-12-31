import { useScreenShare } from '@100mslive/react-sdk'
import {
  Video
} from '@100mslive/roomkit-react'

function SharedScreen () {
  const screenTrack = useScreenShare()
  console.log(screenTrack)

  if (!screenTrack) {
    return null
  }

  return (
    <div className="shared-screen">
      <Video trackId={screenTrack.screenShareVideoTrackId} />
    </div>
  )
}

export default SharedScreen

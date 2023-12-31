import {
  Video
} from '@100mslive/roomkit-react'

function Peer ({ peer }) {
  return (
    <div className="peer">
      <Video trackId={peer.videoTrack} />
      <div className="peer-name">
        {peer.name}
      </div>
    </div>
  )
}

export default Peer

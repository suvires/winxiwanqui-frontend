import { selectPeers, useHMSStore, selectPeersScreenSharing } from '@100mslive/react-sdk'
import React from 'react'
import Peer from './Peer'
import SharedScreen from './SharedScreen'

function Conference () {
  const peers = useHMSStore(selectPeers)
  const peersScreenSharing = useHMSStore(selectPeersScreenSharing)

  return (
    <div className="conference-container">
      <div className="shared-screens-container">
        {Object.keys(peersScreenSharing).map((peerID) => (
          <SharedScreen key={peerID} peerScreenSharing={peersScreenSharing[peerID]} />
        ))}
      </div>
      <div className="peers-container">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  )
}

export default Conference

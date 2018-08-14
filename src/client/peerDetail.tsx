import * as React from 'react'
import { IPeerInfo } from '../ipeerInfo'
import { flag } from './util'

interface IProps {
  detail: IPeerInfo
  peerSize: number
}

export class PeerDetail extends React.Component<IProps> {

  public render() {
    const d = this.props.detail

    return (
      <div style={{ padding: 8 }}>
        <h2>Peers: {this.props.peerSize}</h2>
        {
          d ? <div>
            {info('address', `${d.host}:${d.port}`)}
            {info('location', d.location ?
              `${d.location.city}, ${d.location.country}, ${d.location.region} ${flag(d.location.country)}`
              : 'Unknown (Maybe local network)',
            )}
            {info('version', d.status.version)}
            {info('guid', d.status.guid)}
          </div>
            : ''
        }
      </div>
    )
  }
}

const info = (category, value) => {
  return (
    <div>
      <div>{category}</div>
      <div>{value}</div>
    </div>
  )
}

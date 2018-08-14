import { Lookup } from 'geoip-lite'
import { IPeer, IStatus } from './serialization/proto'

export interface IPeerInfo {
  host: string,
  port: number,
  status: IStatus,
  connected: IPeer[],
  location: Lookup
}

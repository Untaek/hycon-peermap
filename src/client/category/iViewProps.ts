import { IPeerInfo } from '../../ipeerInfo'
export interface IProps {
  details?: Map<string, IPeerInfo>
  status?: IStatus
  startTime?: Date
}

export interface IStatus {
  blockHeight: number,
  difficulty: number
}

import { Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import * as React from 'react'
import { IPeerInfo } from '../ipeerInfo'
import { flag } from './util'

interface IProps {
  detail: IPeerInfo
  peerSize: number
  startTime: Date
}

export class PeerDetail extends React.Component<IProps> {

  public render() {
    const d = this.props.detail

    return (
      <Grid style={{ padding: 8 }}>
        <Typography variant='title' component='h1' gutterBottom>Peers: {this.props.peerSize}</Typography>
        <Typography variant='caption' component='p' color='textSecondary'>{`Peers were searched from ${this.agoString()} ago.`}</Typography>
        {
          d ? <List dense disablePadding>
            {info('address', `${d.host}:${d.port}`)}
            {info('location', d.location ?
              `${d.location.city}, ${d.location.country}, ${d.location.region} ${flag(d.location.country)}`
              : 'Unknown (Maybe local network)',
            )}
            {info('version', d.status.version)}
            {info('guid', d.status.guid)}
          </List>
            : ''
        }
      </Grid>
    )
  }

  private agoString() {
    const ago = Math.round((Date.now() - this.props.startTime.getTime()) / 1000)
    const sec = ago % 60
    const min = Math.floor(ago / 60) % 60
    const hour = Math.floor(ago / 60 / 60) % 24
    const days = Math.floor(ago / 60 / 60 / 24)

    return `
      ${days ? `${days} days,` : ''}
      ${hour ? `${hour} hours, ` : ''}
      ${min ? `${min} mins, ` : ''}
      ${`${sec} secs `}
    `
  }
}

const info = (category, value) => {
  return (
    <ListItem disableGutters dense>
      <ListItemText primary={category} secondary={value} secondaryTypographyProps={{ color: 'secondary' }} />
    </ListItem>
  )
}

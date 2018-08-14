import { Typography } from '@material-ui/core'
import * as React from 'react'

export class Footer extends React.Component {

  public render() {
    return (
      <footer style={{ padding: 70 }}>
        <Typography align='center' gutterBottom variant='title'>
          HYCON
        </Typography>
        <Typography align='center'>
          <a href='https://hycon.io'>hycon.io</a>
        </Typography>
      </footer>
    )
  }
}

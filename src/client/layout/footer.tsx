import { Grid, Typography } from '@material-ui/core'
import { blue, lightBlue } from '@material-ui/core/colors'
import EmailIcon from '@material-ui/icons/EmailOutlined'
import * as React from 'react'

export class Footer extends React.Component {

  public render() {
    return (
      <Grid container direction='column' justify='center' style={{ padding: 100, backgroundColor: lightBlue['500'] }}>
        <Grid item>
          <Typography align='center' gutterBottom variant='display1' >
            <a href='https://hycon.io/'><img alt='hycon.io' src={'./hycon_white.png'} style={{ maxHeight: 64 }} /></a>
          </Typography>
        </Grid>
        <Grid item>
          <Grid container justify='center'>
            <EmailIcon style={{ color: '#dddddd', marginRight: 4 }} />
            <Typography align='center' variant='subheading' color='inherit' style={{ verticalAlign: 'middle' }}>
              contact@hycon.io</Typography>
          </Grid>
        </Grid >
      </Grid >
    )
  }
}

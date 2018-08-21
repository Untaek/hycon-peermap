import { Grid, Typography } from '@material-ui/core'
import { blue, lightBlue } from '@material-ui/core/colors'
import * as React from 'react'

export class Footer extends React.Component {

  public render() {
    return (
      <Grid style={{ paddingTop: 80, height: 600, backgroundColor: blue.A400 }}>
        <Typography align='center' gutterBottom variant='display1' >
          <a href='https://hycon.io'><img src='./hycon_logo1.png' style={{ maxHeight: 320 }} /></a>
        </Typography>

      </Grid>
    )
  }
}

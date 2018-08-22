import { Grid, Typography } from '@material-ui/core'
import { blue, lightBlue } from '@material-ui/core/colors'
import * as React from 'react'

export class Footer extends React.Component {

  public render() {
    return (
      <Grid style={{ paddingTop: 80, height: 600, backgroundColor: blue.A400 }}>
        <Typography align='center' gutterBottom variant='display1' >
          <a href='https://hycon.io/'><img alt='hycon.io' src={'./hycon_white.png'} style={{ maxHeight: 100 }} /></a>
        </Typography>
        <Typography align='center' variant='subheading' color='inherit'>Developed by Untaek Lim</Typography>
        <Typography align='center' variant='subheading' color='inherit'>untaek@hycon.io</Typography>
      </Grid>
    )
  }
}

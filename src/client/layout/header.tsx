import * as React from 'react'

import { AppBar, IconButton, Tab, Tabs, Toolbar, Typography } from '@material-ui/core'
import * as Icon from '@material-ui/icons'

export class Header extends React.Component {

  public render() {
    return (
      <AppBar position='static' color='primary'>
        <Toolbar>
          <IconButton color='inherit'>
            <Icon.Menu />
          </IconButton>
          <Typography variant='title' color='inherit'>HYCON MAP</Typography>
        </Toolbar>
        <Tabs value={0}>
          <Tab label='map' />
          <Tab label='chart' />
        </Tabs>
      </AppBar>
    )
  }
}

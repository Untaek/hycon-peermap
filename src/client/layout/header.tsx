import * as React from 'react'

import { AppBar, Button, Tab, Tabs, Toolbar, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

interface IState {
  url: string
}

export class Header extends React.Component<any, IState> {

  private urls = ['', 'chart', 'status']

  constructor(props) {
    super(props)
    this.state = {
      url: window.location.pathname.split('/')[1],
    }
  }

  public render() {
    const url = window.location.pathname.split('/')[1]
    return (
      <AppBar position='sticky' color='primary'>
        <Toolbar>
          <Typography variant='title' color='inherit' style={{ flexGrow: 1 }}><Link style={{ textDecoration: 'none', color: 'white' }} to='/'>HYCON MAP</Link></Typography>
          <a href='https://hycon.io/'><img alt='hycon.io' src={'./hycon_white.png'} style={{ maxHeight: 50, position: 'absolute', right: 40 }} /></a>
        </Toolbar>
        <Tabs value={this.urls.findIndex((urls) => urls === url)}>
          // @ts-ignore
          <Tab label='map' to='/' component={Link} />
          // @ts-ignore
          <Tab label='chart' to='/chart' component={Link} />
          // @ts-ignore
          <Tab label='status' to='/status' component={Link} />
        </Tabs>
      </AppBar>
    )
  }
}

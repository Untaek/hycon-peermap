import * as React from 'react'

import { AppBar, IconButton, Tab, Tabs, Toolbar, Typography } from '@material-ui/core'
import * as Icon from '@material-ui/icons'
import { Link } from 'react-router-dom';

interface IState {
  tab: number
}

export class Header extends React.Component<any, IState> {

  constructor(props) {
    super(props)
    this.state = {
      tab: 0
    }
  }
  private handleTabChange(index) {
    this.setState({ tab: index })
  }

  public render() {
    return (
      <AppBar position='static' color='primary'>
        <Toolbar>
          <IconButton color='inherit'>
            <Icon.Menu />
          </IconButton>
          <Typography variant='title' color='inherit'>HYCON MAP</Typography>
        </Toolbar>
        <Tabs value={this.state.tab} onChange={(_, i) => this.handleTabChange(i)}>
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

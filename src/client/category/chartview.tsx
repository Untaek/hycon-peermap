import * as React from 'react'
import { GridList, GridListTile, ListSubheader, Card, CardContent, Typography } from '@material-ui/core'
import { Chart } from '../chart'
import { IPeerInfo } from '../../ipeerInfo';

interface IProps {
  details: Map<string, IPeerInfo>
}

interface IState {
  details: Map<string, IPeerInfo>
}

export class ChartView extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      details: this.props.details
    }
  }
  public render() {
    return (
      <div>
        <GridList cellHeight='auto'>
          {/* <GridListTile key='Subheader' cols={2} style={{ height: 'auto' }}>
            <ListSubheader component='div'>Charts</ListSubheader>
          </GridListTile> */}
          <GridListTile key='versions'>
            <Card style={{ margin: 16 }}>
              <CardContent>
                <Typography component='h2' variant='headline' style={{ borderBottom: '1px solid #aaaaaa' }}>Versions</Typography>
                <Chart mode={Chart.PEER_VERSION} details={this.state.details} />

              </CardContent>
            </Card>
          </GridListTile>
          <GridListTile key='countries'>
            <Card style={{ margin: 16 }}>
              <CardContent>
                <Typography component='h2' variant='headline' style={{ borderBottom: '1px solid #aaaaaa' }}>Countries</Typography>
                <Chart mode={Chart.PEER_COUNTRY} details={this.state.details} />
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
      </div>
    )
  }
}
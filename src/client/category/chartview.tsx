import { Card, CardContent, GridList, GridListTile, ListSubheader, Typography } from '@material-ui/core'
import * as React from 'react'
import { IPeerInfo } from '../../ipeerInfo'
import { Chart } from '../chart'
import { IProps } from './iViewProps'

interface IState {
  details: Map<string, IPeerInfo>
}

export class ChartView extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      details: this.props.details,
    }
  }
  public render() {
    return (
      <div>
        <GridList cellHeight='auto'>
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

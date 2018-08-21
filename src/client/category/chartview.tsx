import { Card, CardContent, CardHeader, GridList, GridListTile, ListSubheader, Typography } from '@material-ui/core'
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
      <div style={{ backgroundColor: '#eeeeee' }}>
        <GridList cellHeight='auto'>
          <GridListTile key='versions'>
            <Card style={{ margin: 16 }}>
              <CardHeader
                title='Version'
                subheader='Version share of the network'
              />
              <CardContent>
                <Chart mode={Chart.PEER_VERSION} details={this.state.details} />
              </CardContent>
            </Card>
          </GridListTile>
          <GridListTile key='countries'>
            <Card style={{ margin: 16 }}>
              <CardHeader
                title='Countries'
                subheader='Counrty share of the network'
              />
              <CardContent>
                <Chart mode={Chart.PEER_COUNTRY} details={this.state.details} />
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
      </div>
    )
  }
}

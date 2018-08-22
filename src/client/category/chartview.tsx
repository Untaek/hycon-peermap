import { Card, CardContent, CardHeader, Grid, GridList, GridListTile, ListSubheader, Typography } from '@material-ui/core'
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
      <div style={{ backgroundColor: '#eeeeee', padding: 16 }}>
        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title='Version'
                subheader='Version share of the network'
              />
              <CardContent>
                <Chart mode={Chart.PEER_VERSION} details={this.state.details} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title='Countries'
                subheader='Counrty share of the network'
              />
              <CardContent>
                <Chart mode={Chart.PEER_COUNTRY} details={this.state.details} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

import { CircularProgress, Grid, Typography } from '@material-ui/core'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as zlib from 'zlib'
import { IPeerInfo } from '../ipeerInfo'
import { ChartView } from './category/chartview'
import { IStatus } from './category/iViewProps'
import { MapView } from './category/mapview'
import { StatusView } from './category/statusview'
import { Footer } from './layout/footer'
import { Header } from './layout/header'

interface IState {
  details: Map<string, IPeerInfo>,
  status: IStatus,
  isLoading: boolean,
  startTime: Date
}

export class App extends React.Component<any, IState> {
  /* tslint:disable object-literal-sort-keys */
  constructor(props: any) {
    super(props)
    this.state = {
      details: undefined,
      status: undefined,
      isLoading: true,
      startTime: undefined,
    }
  }

  public async componentDidMount() {
    const polling = async () => {
      const detailsObject = await this.gzipFetch('https://s3.ap-northeast-2.amazonaws.com/peermap1/dataset')
      const status = await this.gzipFetch('https://s3.ap-northeast-2.amazonaws.com/peermap1/status')
      const startTime = new Date(detailsObject.startTime)
      const details = new Map<string, IPeerInfo>()
      for (const key in detailsObject.details) { if (key) { details.set(key, detailsObject.details[key]) } }

      this.setState({ details, status, startTime, isLoading: false })
    }

    polling()
    setInterval(polling, 5000)
  }

  public render() {
    return (
      <div style={{ minHeight: '100%' }}>
        <Header />
        {
          this.state.isLoading ?

            <Grid style={{ padding: 160 }} container justify='center'>
              <CircularProgress size={42} />
            </Grid>

            :

            <Switch>
              <Route exact path='/' render={(props) => <MapView {...props} details={this.state.details} startTime={this.state.startTime} />} />
              <Route exact path='/chart' render={(props) => <ChartView {...props} details={this.state.details} />} />
              <Route exact path='/status' render={(props) => <StatusView {...props} status={this.state.status} />} />
            </Switch>
        }
        <Footer />
      </div >
    )
  }

  private async gzipFetch(url: string) {
    const response = await fetch(url)
    const buffer = zlib.unzipSync(Buffer.from(await response.arrayBuffer()))
    const object = JSON.parse(buffer.toString())
    return object
  }
}

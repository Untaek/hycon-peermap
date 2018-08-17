import { CircularProgress, Typography } from '@material-ui/core'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as zlib from 'zlib'
import { IPeerInfo } from '../ipeerInfo'
import { ChartView } from './category/chartview'
import { MapView } from './category/mapview'
import { StatusView } from './category/statusview'
import { Footer } from './layout/footer'
import { Header } from './layout/header'

interface IState {
  details: Map<string, IPeerInfo>
}

export class App extends React.Component<any, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      details: undefined,
    }
  }

  public async componentDidMount() {
    const response = await fetch('https://s3.ap-northeast-2.amazonaws.com/peermap1/dataset')
    const buf = Buffer.from(await response.arrayBuffer())
    zlib.unzip(buf, (err, data) => {
      const jsonObject = JSON.parse(data.toString())
      const details = new Map<string, IPeerInfo>()
      for (const key in jsonObject) { if (key) { details.set(key, jsonObject[key]) } }
      this.setState({ details })
    })
  }

  public render() {
    const details = this.state.details
    return (
      <div>
        <Header />
        {details ?
          <Switch>
            <Route exact path='/' render={(props) => <MapView {...props} details={details} />} />
            <Route exact path='/chart' render={(props) => <ChartView {...props} details={details} />} />
            <Route exact path='/status' render={(props) => <StatusView {...props} details={details} />} />
          </Switch>
          :
          <div style={{ height: 500, display: 'flex' }}>
            <CircularProgress />
            <Typography>Now loading...</Typography>
          </div>
        }
        <Footer />
      </div >
    )
  }
}

import { CircularProgress, Typography } from '@material-ui/core'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
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
    fetch('/map').then((res) => res.json()).then((json) => {
      const detailsObject = json.data.details

      const details = new Map<string, IPeerInfo>()
      for (const key in detailsObject) { if (key) { details.set(key, detailsObject[key]) } }

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

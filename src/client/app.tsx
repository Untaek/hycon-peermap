import { CircularProgress, Grid, IconButton, Snackbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
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
  startTime: Date,
  snackOpen: boolean
}

export class App extends React.Component<any, IState> {
  private datasetUrl = 'https://s3-us-west-2.amazonaws.com/peermap/dataset'
  private statusUrl = 'https://s3-us-west-2.amazonaws.com/peermap/status'
  private datasetUrltest = 'https://s3.ap-northeast-2.amazonaws.com/peermap1/dataset'
  private statusUrltest = 'https://s3.ap-northeast-2.amazonaws.com/peermap1/status'

  /* tslint:disable object-literal-sort-keys */
  constructor(props: any) {
    super(props)
    this.state = {
      details: undefined,
      status: undefined,
      isLoading: true,
      startTime: undefined,
      snackOpen: true,
    }
  }

  public async componentDidMount() {
    const polling = async () => {
      const detailsObject = await this.gzipFetch(this.datasetUrl)
      const status = await this.gzipFetch(this.statusUrl)
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
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackOpen}
          onClose={this.handleSnackClose}
          autoHideDuration={7000}
          message={this.snackContent()} />
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

  public handleSnackClose = () => {
    this.setState({ snackOpen: false })
  }

  private snackContent() {
    return (
      <div>
        <span>We are constantly improving... Thanks!</span>
        <IconButton
          key='close'
          aria-label='Close'
          color='inherit'
          onClick={this.handleSnackClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
    )
  }

  private async gzipFetch(url: string) {
    const response = await fetch(url)
    const buffer = zlib.unzipSync(Buffer.from(await response.arrayBuffer()))
    const object = JSON.parse(buffer.toString())
    return object
  }
}

import { BottomNavigation, BottomNavigationAction, Button, Card, Divider, Grid, GridList, GridListTile, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import * as React from 'react'
import { Map as MAAP, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import * as vis from 'vis'
import { IPeerInfo } from '../../ipeerInfo'
import { IPeer } from '../../serialization/proto'
import { PeerDetail } from '../peerDetail'
import { flag } from '../util'
import { IProps } from './iViewProps'

interface IState {
  detail: IPeerInfo
  details: Map<string, IPeerInfo>
  edges: vis.DataSet<vis.Edge>
  nodes: vis.DataSet<vis.Node>
  network: vis.Network
  category: number
}

export class MapView extends React.Component<IProps, IState> {
  private buttons: string[] = [
    'circle', 'scatter', /*"location",*/ 'version',
  ]
  private colors: string[] = [
    '#0099ff',
    '#009933',
    '#ff9900',
    '#ff33cc',
    '#999966',
  ]

  private display: HTMLDivElement

  constructor(props) {
    super(props)
    this.state = {
      category: 0,
      detail: undefined,
      details: this.props.details,
      edges: undefined,
      network: undefined,
      nodes: undefined,
    }
  }

  public componentDidMount() {
    const nodes = this.generateNodes(this.state.details)
    const edges = this.generateEdges(this.state.details)
    const network = this.generateNetwork(nodes, edges, this.display)

    this.setState({ edges, network, nodes })
  }

  public render() {
    return (
      <div style={{ backgroundColor: '#eeeeee', padding: 16 }}>
        <Grid container justify='center' spacing={24}>
          <Grid item xs={12} md={6} style={{ height: '100%' }}>
            <Grid container direction='column'>
              <Grid style={{ position: 'absolute', left: 40, top: 200 }}>
                <PeerDetail detail={this.state.detail} peerSize={this.state.details.size} startTime={this.props.startTime} />
              </Grid>
              <Grid item container style={{ position: 'absolute', left: 40, zIndex: 10 }}>
                <BottomNavigation
                  value={this.state.category}
                  onChange={this.handleTabChange}
                  showLabels
                >
                  {
                    this.buttons.map((name) => (
                      <BottomNavigationAction label={name} />
                    ))
                  }
                </BottomNavigation>
              </Grid>
              <Card style={{ backgroundColor: 'white' }}>
                {/* For peer map canvas */}
                <div style={{ height: 720 }} ref={(c) => this.display = c} />
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MAAP style={{ height: 720, width: '100%' }} center={{ lat: 1, lng: 1 }} zoom={2}>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
                />
                {this.createMarkers()}
                {this.createPolylines()}
              </MAAP>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }

  private changeCategory(type: number) {
    let theta = 360 / this.state.details.size
    let r = 1200
    let i = 0
    if (this.state.network === undefined) {
      this.setState({ network: this.generateNetwork(this.state.nodes, this.state.edges, this.display) })
    }
    switch (type) {
      case 0:
        this.state.nodes.forEach((node) => {
          node.x = r * Math.cos(theta * i * Math.PI / 180)
          node.y = r * Math.sin(theta * i * Math.PI / 180)
          i++
          this.state.nodes.update(node)
        })
        this.state.network.setOptions({
          physics: { enabled: false },
        })

        break
      case 1:
        this.state.nodes.forEach((node) => {
          node.x = Math.random() * 1000
          node.y = Math.random() * 100
          this.state.nodes.update(node)
        })
        this.state.network.setOptions({
          physics: {
            barnesHut: {
              gravitationalConstant: -20000,
              springConstant: 0,
              springLength: 1000,
            },
            enabled: true,
          },
        })
        break
      // case "location":
      //   this.state.network.destroy()
      //   this.setState({ network: undefined })

      //   break
      case 2:
        theta = 360 / 8
        r = 3600
        this.state.nodes.forEach((node) => {
          const version = this.state.details.get(node.id.toString()).status.version
          node.x = r * Math.cos(theta * version * Math.PI / 180)
          node.y = r * Math.sin(theta * version * Math.PI / 180)
          i++
          this.state.nodes.update(node)
        })
        this.state.network.setOptions({
          physics: {
            barnesHut: {
              gravitationalConstant: -20000,
              springConstant: 0,
              springLength: 1000,
            },
            enabled: true,
          },
        })
        this.state.network.stabilize()
        break
    }
  }

  private generateNodes(details: Map<string, IPeerInfo>): vis.DataSet<vis.Node> {
    const nodes: any = []

    details.forEach((detail, key) => {
      const shortGuidWithEmoji = `${detail.location ? flag(detail.location.country) : ''}${detail.status.guid.slice(0, 5)}`
      const version = detail.status.version
      const node: any = { id: key, label: shortGuidWithEmoji }

      let size = 0
      for (const peer of details.values()) {
        if (peer.connected.find((val) => `${val.host}:${val.port}` === key)) {
          size++
        }
      }

      node.size = size * 2 + 25

      if (version === 5) {
        node.color = this.colors[0]
      } else if (version === 7) {
        node.color = this.colors[1]
      } else if (version === 8) {
        node.color = this.colors[2]
      } else if (version === 9) {
        node.color = this.colors[3]
      }

      nodes.push(node)
    })
    return new vis.DataSet(nodes)
  }

  private generateEdges(details: Map<string, IPeerInfo>): vis.DataSet<vis.Edge> {
    const edges: any[] = []

    details.forEach((detail, key) => {
      Array.prototype.push.apply(edges,
        detail.connected.map((connection: IPeer, i: number) => {
          const edge: any = { from: key, to: `${connection.host}:${connection.port}` }
          if (details
            .get(`${connection.host}:${connection.port}`)
            .connected
            .find((peer) => `${peer.host}:${peer.port}` === key)
          ) {
            edge.color = { color: 'blue' }
          } else {
            edge.color = { color: 'grey' }
          }
          if (edge.from === '118.40.192.72:8148') {
            edge.hidden = true
          }

          return edge
        }),
      )
    })

    return new vis.DataSet(edges)
  }

  private generateNetwork(nodes: vis.DataSet<vis.Node>, edges: vis.DataSet<vis.Edge>, display: HTMLElement): vis.Network {
    const network = new vis.Network(
      display,
      { edges, nodes },
      {
        autoResize: true,
        clickToUse: true,
        edges: {
          arrows: { to: { enabled: true } },
          smooth: false,
        },

        layout: {
          improvedLayout: true,
        },
        manipulation: {
          enabled: true,
        },
        nodes: {
          shape: 'circle',
        },
        physics: {

          barnesHut: {
            gravitationalConstant: -20000,
            springConstant: 0,
            springLength: 1000,
          },
          enabled: true,
        },
      },
    )

    network.on('click', (info: any) => {
      const key = info.nodes[0]
      const detail = this.state.details.get(key)
      this.setState({ detail })
    })

    return network
  }
  private createMarkers() {
    const markers = []
    for (const peer of this.state.details.values()) {
      if (peer.location) {
        const key = `${peer.host}:${peer.port}`
        markers.push(
          <Marker
            key={key}
            position={{ lat: peer.location.ll[0], lng: peer.location.ll[1] }}
            onClick={(e: any) => {
              const x = this.state.nodes.get(key).x
              const y = this.state.nodes.get(key).y
              this.setState({ detail: peer })
              this.state.network.selectNodes([key])
              this.state.network.focus(key, { animation: true })
            }}
          >
            <Popup key={key}>{key + 1}</Popup>
          </Marker>,
        )
      }
    }
    return markers
  }

  private createPolylines() {
    const latlngs: any[] = []
    if (this.state.details) {
      const details = this.state.details
      details.forEach((val) => {
        if (val.location) {
          latlngs.push([val.location.ll[0], val.location.ll[1]])
          val.connected.forEach((peer) => {
            const key = `${peer.host}:${peer.port}`
            const to = details.get(key).location
            if (to) {
              latlngs.push([to.ll[0], to.ll[1]])
            }
          })
        }
      })
    }

    return <Polyline color='blue' weight={0.4} positions={latlngs} />
  }

  private handleTabChange = (e, v) => {
    this.setState({ category: v })
    this.changeCategory(v)
  }
}

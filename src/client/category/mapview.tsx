import { Divider, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import * as React from 'react'
import { Map as MAAP, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import * as vis from 'vis'
import { IPeerInfo } from '../../ipeerInfo'
import { IPeer } from '../../serialization/proto'
import { PeerDetail } from '../peerDetail'
import { flag } from '../util'

interface IProps {
  details: Map<string, IPeerInfo>
}

interface IState {
  detail: IPeerInfo
  details: Map<string, IPeerInfo>
  edges: vis.DataSet<vis.Edge>
  nodes: vis.DataSet<vis.Node>
  network: vis.Network
  category: string
}

export class MapView extends React.Component<IProps, IState> {
  private buttons: string[] = [
    'circle', 'scatter', /*"location",*/ 'version',
  ]
  private display: HTMLDivElement

  constructor(props) {
    super(props)
    this.state = {
      category: 'scatter',
      detail: undefined,
      details: this.props.details,
      edges: undefined,
      network: undefined,
      nodes: undefined,
    }
  }

  public componentDidMount() {
    if (this.state.details) {
      const nodes = this.generateNodes(this.state.details)
      const edges = this.generateEdges(this.state.details)
      const network = this.generateNetwork(nodes, edges, this.display)

      this.setState({ edges, network, nodes })
    }

  }

  public buttonHandler(category: string) {
    this.setState({ category })
    this.changeCategory(category)
  }

  public changeCategory(type: string) {
    let theta = 360 / this.state.details.size
    let r = 1200
    let i = 0
    if (this.state.network === undefined) {
      this.setState({ network: this.generateNetwork(this.state.nodes, this.state.edges, this.display) })
    }
    switch (type) {
      case 'circle':
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
      case 'scatter':
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
      case 'version':
        theta = 360 / 8
        r = 1600
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
        break
    }
  }

  public generateNodes(details: Map<string, IPeerInfo>): vis.DataSet<vis.Node> {
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
        node.color = 'pink'
      } else if (version === 7) {
        node.color = 'salmon'
      } else if (version === 8) {
        node.color = 'green'
      } else if (version === 9) {
        node.color = 'tomato'
      }

      nodes.push(node)
    })
    return new vis.DataSet(nodes)
  }

  public generateEdges(details: Map<string, IPeerInfo>): vis.DataSet<vis.Edge> {
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
          if (edge.from === '::ffff:118.40.192.72:8148' || edge.from === '118.40.192.72:8148') {
            edge.hidden = true
          }

          return edge
        }),
      )
    })

    return new vis.DataSet(edges)
  }

  public generateNetwork(nodes: vis.DataSet<vis.Node>, edges: vis.DataSet<vis.Edge>, display: HTMLElement): vis.Network {
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
        height: '700',
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
  public createMarkers() {
    if (this.state.details) {
      const markers = []
      for (const peer of this.state.details.values()) {
        if (peer.location) {
          markers.push(
            <Marker
              position={{ lat: peer.location.ll[0], lng: peer.location.ll[1] }}
              onClick={(e: any) => {
                const x = this.state.nodes.get(`${peer.host}:${peer.port}`).x
                const y = this.state.nodes.get(`${peer.host}:${peer.port}`).y
                this.setState({ detail: peer })
                this.state.network.selectNodes([`${peer.host}:${peer.port}`])
                this.state.network.focus(`${peer.host}:${peer.port}`, { animation: true })
              }}
            >
              <Popup>{`${peer.host}:${peer.port}`}</Popup>
            </Marker>,
          )
        }
      }
      return markers
    }
  }

  public createPolylines() {
    const lats: any[] = []
    const lngs: any[] = []
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

  public render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ borderRight: '1px solid #b3e0ff' }}>
          <List component='nav' subheader={<ListSubheader disableSticky component='div' >Category</ListSubheader>}>
            <Divider />
            {
              this.buttons.map((name) => (
                <ListItem divider button onClick={(e) => this.buttonHandler(name)}>
                  <ListItemText primary={name} />
                </ListItem>
              ))
            }
          </List>
        </div>
        <div style={{ position: 'absolute', left: 140 }}>
          {
            this.state.details ? <PeerDetail detail={this.state.detail} peerSize={this.state.details.size} /> : ''
          }
        </div>
        <div ref={(c) => this.display = c} style={{ flex: 1 }} />
        <div style={{ height: 700, flex: 1 }}>
          <MAAP style={{ height: '100%', width: '100%', flex: 1 }} center={{ lat: 1, lng: 1 }} zoom={2}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            {this.createMarkers()}
            {this.createPolylines()}
          </MAAP>
        </div>

      </div>
    )
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
const react_leaflet_1 = require("react-leaflet");
const vis = require("vis");
const peerDetail_1 = require("../peerDetail");
const util_1 = require("../util");
class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.buttons = [
            'circle', 'scatter', /*"location",*/ 'version',
        ];
        this.colors = [
            '#0099ff',
            '#009933',
            '#ff9900',
            '#ff33cc',
            '#999966',
        ];
        this.handleTabChange = (e, v) => {
            this.setState({ category: v });
            this.changeCategory(v);
        };
        this.state = {
            category: 0,
            detail: undefined,
            details: this.props.details,
            edges: undefined,
            network: undefined,
            nodes: undefined,
        };
    }
    componentDidMount() {
        const nodes = this.generateNodes(this.state.details);
        const edges = this.generateEdges(this.state.details);
        const network = this.generateNetwork(nodes, edges, this.display);
        this.setState({ edges, network, nodes });
    }
    render() {
        return (React.createElement("div", { style: { backgroundColor: '#eeeeee', padding: 16 } },
            React.createElement(core_1.Grid, { container: true, justify: 'center', spacing: 24 },
                React.createElement(core_1.Grid, { item: true, xs: 6, style: { height: '100%' } },
                    React.createElement(core_1.Grid, { container: true, direction: 'column' },
                        React.createElement(core_1.Grid, { style: { position: 'absolute', left: 40, top: 200 } },
                            React.createElement(peerDetail_1.PeerDetail, { detail: this.state.detail, peerSize: this.state.details.size, startTime: this.props.startTime })),
                        React.createElement(core_1.Grid, { item: true, container: true, style: { position: 'absolute', left: 40, zIndex: 10 } },
                            React.createElement(core_1.BottomNavigation, { value: this.state.category, onChange: this.handleTabChange, showLabels: true }, this.buttons.map((name) => (React.createElement(core_1.BottomNavigationAction, { label: name }))))),
                        React.createElement(core_1.Card, { style: { backgroundColor: 'white' } },
                            React.createElement("div", { style: { height: 720 }, ref: (c) => this.display = c })))),
                React.createElement(core_1.Grid, { item: true, xs: 6 },
                    React.createElement(core_1.Card, null,
                        React.createElement(react_leaflet_1.Map, { style: { height: 720, width: '100%' }, center: { lat: 1, lng: 1 }, zoom: 2 },
                            React.createElement(react_leaflet_1.TileLayer, { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '\u00A9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }),
                            this.createMarkers(),
                            this.createPolylines()))))));
    }
    changeCategory(type) {
        let theta = 360 / this.state.details.size;
        let r = 1200;
        let i = 0;
        if (this.state.network === undefined) {
            this.setState({ network: this.generateNetwork(this.state.nodes, this.state.edges, this.display) });
        }
        switch (type) {
            case 0:
                this.state.nodes.forEach((node) => {
                    node.x = r * Math.cos(theta * i * Math.PI / 180);
                    node.y = r * Math.sin(theta * i * Math.PI / 180);
                    i++;
                    this.state.nodes.update(node);
                });
                this.state.network.setOptions({
                    physics: { enabled: false },
                });
                break;
            case 1:
                this.state.nodes.forEach((node) => {
                    node.x = Math.random() * 1000;
                    node.y = Math.random() * 100;
                    this.state.nodes.update(node);
                });
                this.state.network.setOptions({
                    physics: {
                        barnesHut: {
                            gravitationalConstant: -20000,
                            springConstant: 0,
                            springLength: 1000,
                        },
                        enabled: true,
                    },
                });
                break;
            // case "location":
            //   this.state.network.destroy()
            //   this.setState({ network: undefined })
            //   break
            case 2:
                theta = 360 / 8;
                r = 3600;
                this.state.nodes.forEach((node) => {
                    const version = this.state.details.get(node.id.toString()).status.version;
                    node.x = r * Math.cos(theta * version * Math.PI / 180);
                    node.y = r * Math.sin(theta * version * Math.PI / 180);
                    i++;
                    this.state.nodes.update(node);
                });
                this.state.network.setOptions({
                    physics: {
                        barnesHut: {
                            gravitationalConstant: -20000,
                            springConstant: 0,
                            springLength: 1000,
                        },
                        enabled: true,
                    },
                });
                this.state.network.stabilize();
                break;
        }
    }
    generateNodes(details) {
        const nodes = [];
        details.forEach((detail, key) => {
            const shortGuidWithEmoji = `${detail.location ? util_1.flag(detail.location.country) : ''}${detail.status.guid.slice(0, 5)}`;
            const version = detail.status.version;
            const node = { id: key, label: shortGuidWithEmoji };
            let size = 0;
            for (const peer of details.values()) {
                if (peer.connected.find((val) => `${val.host}:${val.port}` === key)) {
                    size++;
                }
            }
            node.size = size * 2 + 25;
            if (version === 5) {
                node.color = this.colors[0];
            }
            else if (version === 7) {
                node.color = this.colors[1];
            }
            else if (version === 8) {
                node.color = this.colors[2];
            }
            else if (version === 9) {
                node.color = this.colors[3];
            }
            nodes.push(node);
        });
        return new vis.DataSet(nodes);
    }
    generateEdges(details) {
        const edges = [];
        details.forEach((detail, key) => {
            Array.prototype.push.apply(edges, detail.connected.map((connection, i) => {
                const edge = { from: key, to: `${connection.host}:${connection.port}` };
                if (details
                    .get(`${connection.host}:${connection.port}`)
                    .connected
                    .find((peer) => `${peer.host}:${peer.port}` === key)) {
                    edge.color = { color: 'blue' };
                }
                else {
                    edge.color = { color: 'grey' };
                }
                if (edge.from === '::ffff:118.40.192.72:8148' || edge.from === '118.40.192.72:8148') {
                    edge.hidden = true;
                }
                return edge;
            }));
        });
        return new vis.DataSet(edges);
    }
    generateNetwork(nodes, edges, display) {
        const network = new vis.Network(display, { edges, nodes }, {
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
        });
        network.on('click', (info) => {
            const key = info.nodes[0];
            const detail = this.state.details.get(key);
            this.setState({ detail });
        });
        return network;
    }
    createMarkers() {
        const markers = [];
        for (const peer of this.state.details.values()) {
            if (peer.location) {
                const key = `${peer.host}:${peer.port}`;
                markers.push(React.createElement(react_leaflet_1.Marker, { key: key, position: { lat: peer.location.ll[0], lng: peer.location.ll[1] }, onClick: (e) => {
                        const x = this.state.nodes.get(key).x;
                        const y = this.state.nodes.get(key).y;
                        this.setState({ detail: peer });
                        this.state.network.selectNodes([key]);
                        this.state.network.focus(key, { animation: true });
                    } },
                    React.createElement(react_leaflet_1.Popup, { key: key }, key + 1)));
            }
        }
        return markers;
    }
    createPolylines() {
        const latlngs = [];
        if (this.state.details) {
            const details = this.state.details;
            details.forEach((val) => {
                if (val.location) {
                    latlngs.push([val.location.ll[0], val.location.ll[1]]);
                    val.connected.forEach((peer) => {
                        const key = `${peer.host}:${peer.port}`;
                        const to = details.get(key).location;
                        if (to) {
                            latlngs.push([to.ll[0], to.ll[1]]);
                        }
                    });
                }
            });
        }
        return React.createElement(react_leaflet_1.Polyline, { color: 'blue', weight: 0.4, positions: latlngs });
    }
}
exports.MapView = MapView;

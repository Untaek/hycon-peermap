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
        this.state = {
            category: 'scatter',
            detail: undefined,
            details: this.props.details,
            edges: undefined,
            network: undefined,
            nodes: undefined,
        };
    }
    componentDidMount() {
        if (this.state.details) {
            const nodes = this.generateNodes(this.state.details);
            const edges = this.generateEdges(this.state.details);
            const network = this.generateNetwork(nodes, edges, this.display);
            this.setState({ edges, network, nodes });
        }
    }
    buttonHandler(category) {
        this.setState({ category });
        this.changeCategory(category);
    }
    changeCategory(type) {
        let theta = 360 / this.state.details.size;
        let r = 1200;
        let i = 0;
        if (this.state.network === undefined) {
            this.setState({ network: this.generateNetwork(this.state.nodes, this.state.edges, this.display) });
        }
        switch (type) {
            case 'circle':
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
            case 'scatter':
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
            case 'version':
                theta = 360 / 8;
                r = 1600;
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
                node.color = 'pink';
            }
            else if (version === 7) {
                node.color = 'salmon';
            }
            else if (version === 8) {
                node.color = 'green';
            }
            else if (version === 9) {
                node.color = 'tomato';
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
        });
        network.on('click', (info) => {
            const key = info.nodes[0];
            const detail = this.state.details.get(key);
            this.setState({ detail });
        });
        return network;
    }
    createMarkers() {
        if (this.state.details) {
            const markers = [];
            for (const peer of this.state.details.values()) {
                if (peer.location) {
                    markers.push(React.createElement(react_leaflet_1.Marker, { position: { lat: peer.location.ll[0], lng: peer.location.ll[1] }, onClick: (e) => {
                            const x = this.state.nodes.get(`${peer.host}:${peer.port}`).x;
                            const y = this.state.nodes.get(`${peer.host}:${peer.port}`).y;
                            this.setState({ detail: peer });
                            this.state.network.selectNodes([`${peer.host}:${peer.port}`]);
                            this.state.network.focus(`${peer.host}:${peer.port}`, { animation: true });
                        } },
                        React.createElement(react_leaflet_1.Popup, null, `${peer.host}:${peer.port}`)));
                }
            }
            return markers;
        }
    }
    createPolylines() {
        const lats = [];
        const lngs = [];
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
    render() {
        return (React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
            React.createElement("div", { style: { borderRight: '1px solid #b3e0ff' } },
                React.createElement(core_1.List, { component: 'nav', subheader: React.createElement(core_1.ListSubheader, { disableSticky: true, component: 'div' }, "Category") },
                    React.createElement(core_1.Divider, null),
                    this.buttons.map((name) => (React.createElement(core_1.ListItem, { divider: true, button: true, onClick: (e) => this.buttonHandler(name) },
                        React.createElement(core_1.ListItemText, { primary: name })))))),
            React.createElement("div", { style: { position: 'absolute', left: 140 } }, this.state.details ? React.createElement(peerDetail_1.PeerDetail, { detail: this.state.detail, peerSize: this.state.details.size }) : ''),
            React.createElement("div", { ref: (c) => this.display = c, style: { flex: 1 } }),
            React.createElement("div", { style: { height: 700, flex: 1 } },
                React.createElement(react_leaflet_1.Map, { style: { height: '100%', width: '100%', flex: 1 }, center: { lat: 1, lng: 1 }, zoom: 2 },
                    React.createElement(react_leaflet_1.TileLayer, { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '\u00A9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }),
                    this.createMarkers(),
                    this.createPolylines()))));
    }
}
exports.MapView = MapView;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const util_1 = require("./util");
class PeerDetail extends React.Component {
    render() {
        const d = this.props.detail;
        return (React.createElement("div", { style: { padding: 8 } },
            React.createElement("h2", null,
                "Peers: ",
                this.props.peerSize),
            d ? React.createElement("div", null,
                info('address', `${d.host}:${d.port}`),
                info('location', d.location ?
                    `${d.location.city}, ${d.location.country}, ${d.location.region} ${util_1.flag(d.location.country)}`
                    : 'Unknown (Maybe local network)'),
                info('version', d.status.version),
                info('guid', d.status.guid))
                : ''));
    }
}
exports.PeerDetail = PeerDetail;
const info = (category, value) => {
    return (React.createElement("div", null,
        React.createElement("div", null, category),
        React.createElement("div", null, value)));
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
const util_1 = require("./util");
class PeerDetail extends React.Component {
    render() {
        const d = this.props.detail;
        return (React.createElement(core_1.Grid, { style: { padding: 8 } },
            React.createElement(core_1.Typography, { variant: 'title', component: 'h1', gutterBottom: true },
                "Peers: ",
                this.props.peerSize),
            React.createElement(core_1.Typography, { variant: 'caption', component: 'p', color: 'textSecondary' }, `Peers were searched since ${this.props.startTime}`),
            d ? React.createElement(core_1.List, { dense: true, disablePadding: true },
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
    return (React.createElement(core_1.ListItem, { disableGutters: true, dense: true, divider: true },
        React.createElement(core_1.ListItemText, { primary: category, secondary: value, secondaryTypographyProps: { color: 'secondary' } })));
};

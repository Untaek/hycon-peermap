"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
const chart_1 = require("../chart");
class ChartView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: this.props.details,
        };
    }
    render() {
        return (React.createElement("div", { style: { backgroundColor: '#eeeeee' } },
            React.createElement(core_1.GridList, { cellHeight: 'auto' },
                React.createElement(core_1.GridListTile, { key: 'versions' },
                    React.createElement(core_1.Card, { style: { margin: 16 } },
                        React.createElement(core_1.CardHeader, { title: 'Version', subheader: 'Version share of the network' }),
                        React.createElement(core_1.CardContent, null,
                            React.createElement(chart_1.Chart, { mode: chart_1.Chart.PEER_VERSION, details: this.state.details })))),
                React.createElement(core_1.GridListTile, { key: 'countries' },
                    React.createElement(core_1.Card, { style: { margin: 16 } },
                        React.createElement(core_1.CardHeader, { title: 'Countries', subheader: 'Counrty share of the network' }),
                        React.createElement(core_1.CardContent, null,
                            React.createElement(chart_1.Chart, { mode: chart_1.Chart.PEER_COUNTRY, details: this.state.details })))))));
    }
}
exports.ChartView = ChartView;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
class StatusView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { style: { backgroundColor: '#eeeeee', padding: 16 } },
            React.createElement(core_1.Grid, { container: true, direction: 'column', justify: 'center', spacing: 16 },
                React.createElement(core_1.Grid, { item: true },
                    React.createElement(core_1.Paper, { elevation: 2, style: { padding: 16 } },
                        React.createElement(core_1.Typography, { variant: 'subheading', component: 'h3' }, "Current Block height"),
                        React.createElement(core_1.Typography, { variant: 'title', component: 'h1' }, this.props.status.blockHeight))),
                React.createElement(core_1.Grid, { item: true },
                    React.createElement(core_1.Paper, { elevation: 2, style: { padding: 16 } },
                        React.createElement(core_1.Typography, { variant: 'subheading', component: 'h3' },
                            "Current difficulty ",
                            React.createElement(core_1.Typography, { color: 'textSecondary' }, "(Convert to Hexadecimal)")),
                        React.createElement(core_1.Typography, { variant: 'title', component: 'h1' }, this.props.status.difficulty),
                        React.createElement(core_1.Typography, { variant: 'subheading', component: 'h2', color: 'textSecondary' },
                            "(0x",
                            this.getHexTarget(this.props.status.difficulty),
                            ")"))),
                React.createElement(core_1.Grid, { item: true },
                    React.createElement(core_1.Paper, { elevation: 2, style: { padding: 16 } },
                        React.createElement(core_1.Typography, { variant: 'subheading', component: 'h3' }, "Presumed hash power"),
                        React.createElement(core_1.Typography, { variant: 'title', component: 'h1' }, `${(1 / (this.props.status.difficulty * 30 / Math.LN2) / 1000).toFixed(2)} Khs`))))));
    }
    getHexTarget(p, length = 32) {
        if (p > 1) {
            p = 1;
        }
        if (p < Math.pow(0x100, -length)) {
            p = Math.pow(0x100, -length);
        }
        const target = Buffer.alloc(length);
        let carry = 0;
        for (let i = length - 1; i >= 0; i--) {
            carry = (0x100 * carry) + (p * 0xFF);
            target[i] = Math.floor(carry);
            carry -= target[i];
        }
        const buf = Buffer.from(target.slice(0, 32));
        return Buffer.from(buf.reverse()).toString('hex');
    }
}
exports.StatusView = StatusView;

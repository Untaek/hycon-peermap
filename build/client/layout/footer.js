"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
class Footer extends React.Component {
    render() {
        return (React.createElement("footer", { style: { padding: 70 } },
            React.createElement(core_1.Typography, { align: 'center', gutterBottom: true, variant: 'title' }, "HYCON"),
            React.createElement(core_1.Typography, { align: 'center' },
                React.createElement("a", { href: 'https://hycon.io' }, "hycon.io"))));
    }
}
exports.Footer = Footer;

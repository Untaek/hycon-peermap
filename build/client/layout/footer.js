"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const colors_1 = require("@material-ui/core/colors");
const React = require("react");
class Footer extends React.Component {
    render() {
        return (React.createElement(core_1.Grid, { style: { paddingTop: 80, height: 600, backgroundColor: colors_1.blue.A400 } },
            React.createElement(core_1.Typography, { align: 'center', gutterBottom: true, variant: 'display1' },
                React.createElement("a", { href: 'https://hycon.io' },
                    React.createElement("img", { src: './hycon_logo1.png', style: { maxHeight: 320 } })))));
    }
}
exports.Footer = Footer;

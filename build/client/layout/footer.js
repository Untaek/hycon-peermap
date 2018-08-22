"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const colors_1 = require("@material-ui/core/colors");
const React = require("react");
class Footer extends React.Component {
    render() {
        return (React.createElement(core_1.Grid, { style: { paddingTop: 80, height: 600, backgroundColor: colors_1.blue.A400 } },
            React.createElement(core_1.Typography, { align: 'center', gutterBottom: true, variant: 'display1' },
                React.createElement("a", { href: 'https://hycon.io/' },
                    React.createElement("img", { alt: 'hycon.io', src: './hycon_white.png', style: { maxHeight: 64 } }))),
            React.createElement(core_1.Typography, { align: 'center', variant: 'subheading', color: 'inherit' }, "Developed by Untaek Lim"),
            React.createElement(core_1.Typography, { align: 'center', variant: 'subheading', color: 'inherit' }, "untaek@hycon.io")));
    }
}
exports.Footer = Footer;

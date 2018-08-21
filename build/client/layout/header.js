"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const react_router_dom_1 = require("react-router-dom");
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.urls = ['', 'chart', 'status'];
        this.state = {
            url: window.location.pathname.split('/')[1],
        };
    }
    render() {
        const url = window.location.pathname.split('/')[1];
        return (React.createElement(core_1.AppBar, { position: 'sticky', color: 'primary' },
            React.createElement(core_1.Toolbar, null,
                React.createElement(core_1.Typography, { variant: 'title', color: 'inherit', style: { flexGrow: 1 } },
                    React.createElement(react_router_dom_1.Link, { style: { textDecoration: 'none', color: 'white' }, to: '/' }, "HYCON MAP")),
                React.createElement("a", { href: 'https://hycon.io/' },
                    React.createElement("img", { alt: 'hycon.io', src: './hycon_white.png', style: { maxHeight: 50, position: 'absolute', right: 40 } }))),
            React.createElement(core_1.Tabs, { value: this.urls.findIndex((urls) => urls === url) },
                "// @ts-ignore",
                React.createElement(core_1.Tab, { label: 'map', to: '/', component: react_router_dom_1.Link })
            // @ts-ignore
            ,
                "// @ts-ignore",
                React.createElement(core_1.Tab, { label: 'chart', to: '/chart', component: react_router_dom_1.Link })
            // @ts-ignore
            ,
                "// @ts-ignore",
                React.createElement(core_1.Tab, { label: 'status', to: '/status', component: react_router_dom_1.Link }))));
    }
}
exports.Header = Header;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const Icon = require("@material-ui/icons");
const react_router_dom_1 = require("react-router-dom");
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
        };
    }
    render() {
        return (React.createElement(core_1.AppBar, { position: 'static', color: 'primary' },
            React.createElement(core_1.Toolbar, null,
                React.createElement(core_1.IconButton, { color: 'inherit' },
                    React.createElement(Icon.Menu, null)),
                React.createElement(core_1.Typography, { variant: 'title', color: 'inherit' }, "HYCON MAP")),
            React.createElement(core_1.Tabs, { value: this.state.tab, onChange: (_, i) => this.handleTabChange(i) },
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
    handleTabChange(index) {
        this.setState({ tab: index });
    }
}
exports.Header = Header;

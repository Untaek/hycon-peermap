"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ReactGA = require("react-ga");
const core_1 = require("@material-ui/core");
const colors_1 = require("@material-ui/core/colors");
const react_router_dom_1 = require("react-router-dom");
const app_1 = require("./app");
ReactGA.initialize('UA-116359227-2');
ReactGA.pageview(window.location.pathname + window.location.search);
const theme = core_1.createMuiTheme({
    overrides: {
        MuiTabs: {
            root: {
                color: 'white',
            },
        },
        MuiTypography: {
            colorInherit: {
                color: '#dddddd',
            },
        },
    },
    palette: {
        primary: colors_1.lightBlue,
        secondary: colors_1.blue,
    },
});
ReactDOM.render(React.createElement(react_router_dom_1.BrowserRouter, null,
    React.createElement(core_1.MuiThemeProvider, { theme: theme },
        React.createElement(app_1.App, null))), document.getElementById('root'));

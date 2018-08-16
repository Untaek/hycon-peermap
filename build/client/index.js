"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ReactGA = require("react-ga");
const react_router_dom_1 = require("react-router-dom");
const app_1 = require("./app");
ReactGA.initialize('UA-116359227-2');
ReactGA.pageview(window.location.pathname + window.location.search);
ReactDOM.render(React.createElement(react_router_dom_1.BrowserRouter, null,
    React.createElement(app_1.App, null)), document.getElementById('root'));

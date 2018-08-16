"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@material-ui/core");
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const chartview_1 = require("./category/chartview");
const mapview_1 = require("./category/mapview");
const statusview_1 = require("./category/statusview");
const footer_1 = require("./layout/footer");
const header_1 = require("./layout/header");
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: undefined,
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            fetch('/map').then((res) => res.json()).then((json) => {
                const detailsObject = json.data.details;
                const details = new Map();
                for (const key in detailsObject) {
                    if (key) {
                        details.set(key, detailsObject[key]);
                    }
                }
                this.setState({ details });
            });
        });
    }
    render() {
        const details = this.state.details;
        return (React.createElement("div", null,
            React.createElement(header_1.Header, null),
            details ?
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/', render: (props) => React.createElement(mapview_1.MapView, Object.assign({}, props, { details: details })) }),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/chart', render: (props) => React.createElement(chartview_1.ChartView, Object.assign({}, props, { details: details })) }),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/status', render: (props) => React.createElement(statusview_1.StatusView, Object.assign({}, props, { details: details })) }))
                :
                    React.createElement("div", { style: { height: 500, display: 'flex' } },
                        React.createElement(core_1.CircularProgress, null),
                        React.createElement(core_1.Typography, null, "Now loading...")),
            React.createElement(footer_1.Footer, null)));
    }
}
exports.App = App;

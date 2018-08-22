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
const Close_1 = require("@material-ui/icons/Close");
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const zlib = require("zlib");
const chartview_1 = require("./category/chartview");
const mapview_1 = require("./category/mapview");
const statusview_1 = require("./category/statusview");
const footer_1 = require("./layout/footer");
const header_1 = require("./layout/header");
class App extends React.Component {
    /* tslint:disable object-literal-sort-keys */
    constructor(props) {
        super(props);
        this.datasetUrl = 'https://s3-us-west-2.amazonaws.com/peermap/dataset';
        this.statusUrl = 'https://s3-us-west-2.amazonaws.com/peermap/status';
        this.datasetUrltest = 'https://s3.ap-northeast-2.amazonaws.com/peermap1/dataset';
        this.statusUrltest = 'https://s3.ap-northeast-2.amazonaws.com/peermap1/status';
        this.handleSnackClose = () => {
            this.setState({ snackOpen: false });
        };
        this.state = {
            details: undefined,
            status: undefined,
            isLoading: true,
            startTime: undefined,
            snackOpen: true,
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const polling = () => __awaiter(this, void 0, void 0, function* () {
                const detailsObject = yield this.gzipFetch(this.datasetUrl);
                const status = yield this.gzipFetch(this.statusUrl);
                const startTime = new Date(detailsObject.startTime);
                const details = new Map();
                for (const key in detailsObject.details) {
                    if (key) {
                        details.set(key, detailsObject.details[key]);
                    }
                }
                this.setState({ details, status, startTime, isLoading: false });
            });
            polling();
            setInterval(polling, 5000);
        });
    }
    render() {
        return (React.createElement("div", { style: { minHeight: '100%' } },
            React.createElement(core_1.Snackbar, { anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, open: this.state.snackOpen, onClose: this.handleSnackClose, autoHideDuration: 7000, message: this.snackContent() }),
            React.createElement(header_1.Header, null),
            this.state.isLoading ?
                React.createElement(core_1.Grid, { style: { padding: 160 }, container: true, justify: 'center' },
                    React.createElement(core_1.CircularProgress, { size: 42 }))
                :
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Route, { exact: true, path: '/', render: (props) => React.createElement(mapview_1.MapView, Object.assign({}, props, { details: this.state.details, startTime: this.state.startTime })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: '/chart', render: (props) => React.createElement(chartview_1.ChartView, Object.assign({}, props, { details: this.state.details })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: '/status', render: (props) => React.createElement(statusview_1.StatusView, Object.assign({}, props, { status: this.state.status })) })),
            React.createElement(footer_1.Footer, null)));
    }
    snackContent() {
        return (React.createElement("div", null,
            React.createElement("span", null, "We are constantly improving... Thanks!"),
            React.createElement(core_1.IconButton, { key: 'close', "aria-label": 'Close', color: 'inherit', onClick: this.handleSnackClose },
                React.createElement(Close_1.default, null))));
    }
    gzipFetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            const buffer = zlib.unzipSync(Buffer.from(yield response.arrayBuffer()));
            const object = JSON.parse(buffer.toString());
            return object;
        });
    }
}
exports.App = App;

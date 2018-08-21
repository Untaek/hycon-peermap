"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Chartjs = require("react-chartjs-2");
const util_1 = require("./util");
class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.colors = [
            '#0099ff',
            '#009933',
            '#ff9900',
            '#ff33cc',
            '#999966',
        ];
        this.VersionPieChart = (details) => {
            const dataset = this.versionDatasets(details);
            return (React.createElement(Chartjs.Doughnut, { data: dataset }));
        };
        this.CountryBarChart = (details) => {
            const dataset = this.countryDatasets(details);
            return (React.createElement(Chartjs.Bar, { data: dataset.data, options: dataset.options }));
        };
    }
    render() {
        return (React.createElement("div", null, this.route()));
    }
    route() {
        const details = this.props.details;
        if (details === undefined) {
            return React.createElement("div", null);
        }
        switch (this.props.mode) {
            case Chart.PEER_VERSION:
                return this.VersionPieChart(details);
            case Chart.PEER_COUNTRY:
                return this.CountryBarChart(details);
            default:
                return '';
        }
    }
    versionDatasets(details) {
        const data = {};
        if (details) {
            for (const value of details.values()) {
                const version = value.status.version;
                if (data[version] === undefined) {
                    data[version] = 1;
                }
                else {
                    data[version]++;
                }
            }
            return ({
                datasets: [
                    {
                        backgroundColor: this.colors,
                        data: Object.keys(data).map((key) => data[key]),
                        options: {
                            title: {
                                display: true,
                                text: 'Custom Chart Title',
                            },
                        },
                    },
                ],
                labels: Object.keys(data),
            });
        }
    }
    countryDatasets(details) {
        const data = {};
        for (const value of details.values()) {
            if (value.location) {
                const country = value.location.country;
                if (data[country] === undefined) {
                    data[country] = 1;
                }
                else {
                    data[country]++;
                }
            }
        }
        return ({
            data: {
                datasets: [{
                        backgroundColor: this.colors,
                        data: Object.keys(data).map((key) => data[key]),
                        label: 'Peers',
                    }],
                labels: Object.keys(data).map((key) => `${util_1.flag(key)}${key}`),
            },
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            },
                        }],
                },
            },
        });
    }
}
Chart.PEER_VERSION = 'version';
Chart.PEER_COUNTRY = 'country';
exports.Chart = Chart;

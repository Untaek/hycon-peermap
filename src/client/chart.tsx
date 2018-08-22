import * as React from 'react'
import * as Chartjs from 'react-chartjs-2'
import { IPeerInfo } from '../ipeerInfo'
import { flag } from './util'

interface IProps {
  details: Map<string, IPeerInfo>
  mode: string
}

export class Chart extends React.Component<IProps> {
  public static PEER_VERSION = 'version'
  public static PEER_COUNTRY = 'country'

  private colors: string[] = [
    '#0099ff',
    '#009933',
    '#ff9900',
    '#ff33cc',
    '#999966',
  ]

  constructor(props: IProps) {
    super(props)
  }

  public render() {
    return (
      <div>{this.route()}</div>
    )
  }

  private route() {
    const details = this.props.details
    if (details === undefined) { return <div></div> }
    switch (this.props.mode) {
      case Chart.PEER_VERSION:
        return this.VersionPieChart(details)
      case Chart.PEER_COUNTRY:
        return this.CountryBarChart(details)
      default:
        return ''
    }
  }

  private VersionPieChart = (details: any) => {
    const dataset = this.versionDatasets(details)
    return (
      <Chartjs.Doughnut data={dataset} />
    )
  }

  private CountryBarChart = (details: any) => {
    const dataset = this.countryDatasets(details)
    return (
      <Chartjs.Bar data={dataset.data} options={dataset.options} />
    )
  }

  private versionDatasets(details: Map<string, IPeerInfo>) {
    const data: any = {}
    if (details) {
      for (const value of details.values()) {
        const version = value.status.version
        if (data[version] === undefined) {
          data[version] = 1
        } else {
          data[version]++
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
      })
    }
  }

  private countryDatasets(details: Map<string, IPeerInfo>) {
    const data: any = {}
    for (const value of details.values()) {
      if (value.location) {
        const country = value.location.country
        if (data[country] === undefined) {
          data[country] = 1
        } else {
          data[country]++
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
        labels: Object.keys(data).map((key) => `${flag(key)}${key}`),
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

    })
  }
}

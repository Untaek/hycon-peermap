import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactGA from 'react-ga'

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { blue, lightBlue } from '@material-ui/core/colors'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { App } from './app'

ReactGA.initialize('UA-116359227-2')
ReactGA.pageview(window.location.pathname + window.location.search)

const theme = createMuiTheme({
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
    primary: lightBlue,
    secondary: blue,
  },
})

ReactDOM.render(

  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>
  ,
  document.getElementById('root'),
)

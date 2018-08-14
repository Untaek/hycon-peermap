import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactGA from 'react-ga'

import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { App } from './app'

ReactGA.initialize('UA-116359227-2')
ReactGA.pageview(window.location.pathname + window.location.search)

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('root'),
)

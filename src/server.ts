import bodyParser = require('body-parser')
import * as Express from 'express'
import helmet = require('helmet')
import { getLogger } from 'log4js'
import * as morgan from 'morgan'
import path = require('path')
import favicon = require('serve-favicon')

const logger = getLogger('Server')

export class Server {
  private app: Express.Application
  private config = {
    host: 'localhost',
    port: 8888,
  }

  constructor() {
    this.init()
  }

  public start() {
    this.app.listen(this.config.port, () => {
      logger.info('Server is running... ' + '')
    })
  }

  private init() {
    this.app = Express()
    this.app.use(Express.static(path.resolve(__dirname, '../dist')))
    this.app.use(bodyParser.json())
    this.app.use(morgan('dev'))
    this.app.use(helmet())
    this.app.use(favicon(path.resolve(__dirname, '../dist/hycon.ico')))
    this.app.use('/', this.router())
  }

  private router() {
    const router = Express.Router()

    router.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    })
    return router
  }
}

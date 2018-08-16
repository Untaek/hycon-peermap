"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const Express = require("express");
const helmet = require("helmet");
const log4js_1 = require("log4js");
const morgan = require("morgan");
const path = require("path");
const logger = log4js_1.getLogger('Server');
class Server {
    constructor() {
        this.config = {
            host: 'localhost',
            port: 8888,
        };
        this.init();
    }
    start() {
        this.app.listen(this.config.port, () => {
            logger.info('Server is running... ' + '');
        });
    }
    init() {
        this.app = Express();
        this.app.use(Express.static(path.resolve(__dirname, '../dist')));
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use('/', this.router());
    }
    router() {
        const router = Express.Router();
        router.get('/', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../dist/index.html'));
        });
        return router;
    }
}
exports.Server = Server;

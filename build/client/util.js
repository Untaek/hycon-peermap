"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable no-var-requires no-bitwise */
const flagEmoji = require('emoji-flags');
exports.flag = (country) => flagEmoji.countryCode(country).emoji;
exports.randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

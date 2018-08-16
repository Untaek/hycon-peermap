"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flagEmoji = require('emoji-flags');
exports.flag = (country) => flagEmoji.countryCode(country).emoji;
exports.randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

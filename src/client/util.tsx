const flagEmoji = require('emoji-flags')

export const flag = (country: string): string =>
  flagEmoji.countryCode(country).emoji

export const randomColor = (): string => '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

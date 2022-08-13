const { Base64 } = require('js-base64');
const mapRGBAImage = require('./png');
const mapElement = require('./xml');

module.exports = {
  Png: {
    fromRGBAImage(rgbaImage) {
      return mapRGBAImage(rgbaImage);
    },
  },
  Xml: {
    fromElement(element) {
      return mapElement(element);
    },
  },
  Base64: {
    fromUint8Array(array) {
      return Base64.fromUint8Array(array);
    },
  },
};

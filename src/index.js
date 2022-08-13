const mapRGBAImage = require('./png');
const mapElement = require('./xml');

module.exports = {
  Png: {
    toPng(rgbaImage) {
      return mapRGBAImage(rgbaImage);
    },
  },
  Xml: {
    toXml(element) {
      return mapElement(element);
    },
  },
};

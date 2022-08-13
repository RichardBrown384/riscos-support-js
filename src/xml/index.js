/*

Primitive JSON to XML mapper. Expects the following format:

const svg = {
  tag: 'svg',
  attributes: {
    width: '200',
    height: '400',
  },
  children: [{
    tag: 'path',
    attributes: {
      d: 'z',
    },
  }, {
    tag: 'circle',
    attributes: {
      cx: '50',
      cy: '20',
    },
  }],
  text: 'your browser doesn't support svg',
};

Warning: Doesn't sanitize attributes or text. Use at your own risk.
 */

function mapAttributes(attributes = {}) {
  return Object.entries(attributes)
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
}

function mapElement({
  tag, attributes = {}, children = [], text = '',
}) {
  const result = [];
  const xmlAttributes = mapAttributes(attributes);
  if (children.length === 0 && text.length === 0) {
    result.push(`<${tag} ${xmlAttributes}/>`);
  } else {
    result.push(`<${tag} ${xmlAttributes}>`);
    for (let i = 0; i < children.length; i += 1) {
      result.push(mapElement(children[i]));
    }
    if (text.length !== 0) {
      result.push(text);
    }
    result.push(`</${tag}>`);
  }
  return result.join('');
}

module.exports = mapElement;

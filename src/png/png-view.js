const CRC32 = require('crc-32');

class PngView {
  constructor(array, position = 0) {
    this.array = array;
    this.view = new DataView(array.buffer);
    this.position = position;
  }

  writeUint8(b) {
    this.view.setUint8(this.position, b);
    this.position += 1;
    return this.position;
  }

  writeUint8s(data) {
    this.array.set(data, this.position);
    this.position += data.length;
    return this.position;
  }

  writeUint32(v) {
    this.view.setUint32(this.position, v);
    this.position += 4;
    return this.position;
  }

  writeInt32(v) {
    this.view.setInt32(this.position, v);
    this.position += 4;
    return this.position;
  }

  crc32From(start) {
    return CRC32.buf(this.array.slice(start, this.position));
  }
}

module.exports = PngView;

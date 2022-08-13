const pako = require('pako');
const PngView = require('./png-view');

const FILE_HEADER = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

const FILE_HEADER_SIZE = 8;
const LENGTH_SIZE = 4;
const TYPE_SIZE = 4;
const CRC32_SIZE = 4;

const CONTROL_STRUCTURE_SIZE = LENGTH_SIZE + TYPE_SIZE + CRC32_SIZE;

const IHDR_LENGTH = 13;
const IEND_LENGTH = 0;

const FILTER_TYPE_NONE = 0;

const COLOUR_TYPE_RGBA = 6;

function createUint8s(string) {
  return [...string].map((char) => char.charCodeAt(0));
}

function createPngImage({
  width,
  height,
  imageData,
  bitDepth,
  colourType,
  compressionMethod = 0,
  filterMethod = 0,
  interlaceMethod = 0,
}) {
  const idatLength = imageData.length;
  const size = FILE_HEADER_SIZE
        + (CONTROL_STRUCTURE_SIZE + IHDR_LENGTH)
        + (CONTROL_STRUCTURE_SIZE + idatLength)
        + (CONTROL_STRUCTURE_SIZE + IEND_LENGTH);

  const array = new Uint8Array(size);
  const view = new PngView(array);

  view.writeUint8s(FILE_HEADER);

  const ihdrStart = view.writeUint32(IHDR_LENGTH);
  view.writeUint8s(createUint8s('IHDR'));
  view.writeUint32(width);
  view.writeUint32(height);
  view.writeUint8s([
    bitDepth,
    colourType,
    compressionMethod,
    filterMethod,
    interlaceMethod,
  ]);
  view.writeInt32(view.crc32From(ihdrStart));

  const idatStart = view.writeUint32(idatLength);
  view.writeUint8s(createUint8s('IDAT'));
  view.writeUint8s(imageData);
  view.writeInt32(view.crc32From(idatStart));

  const iendStart = view.writeUint32(IEND_LENGTH);
  view.writeUint8s(createUint8s('IEND'));
  view.writeInt32(view.crc32From(iendStart));

  return array;
}

function filterImage({ width, height, pixels }) {
  const filteredSize = height * (1 + 4 * width);

  const array = new Uint8Array(filteredSize);
  const view = new PngView(array);

  for (let y = 0, srcOffset = 0; y < height; y += 1) {
    view.writeUint8(FILTER_TYPE_NONE);
    for (let x = 0; x < width; x += 1) {
      view.writeUint8(pixels[srcOffset]);
      view.writeUint8(pixels[srcOffset + 1]);
      view.writeUint8(pixels[srcOffset + 2]);
      view.writeUint8(pixels[srcOffset + 3]);
      srcOffset += 4;
    }
  }

  return array;
}

function mapRGBAImage({ width, height, pixels }) {
  const filtered = filterImage({ width, height, pixels });
  return createPngImage({
    width,
    height,
    imageData: pako.deflate(filtered),
    bitDepth: 8,
    colourType: COLOUR_TYPE_RGBA,
  });
}

module.exports = mapRGBAImage;

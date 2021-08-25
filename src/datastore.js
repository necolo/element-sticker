const path = require('path');
const fs = require('fs').promises;

const filename = path.join(__dirname, '../data.json');

async function exists(filename) {
  try {
    await fs.access(filename);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }
  return true;
}

async function read () {
  if (await exists(filename)) {
    return JSON.parse((await fs.readFile(filename)).toString());
  }
  return write([]);
}

async function write (data) {
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
  return data;
}


function swapArray(arr, a, b) {
  const t = arr[a];
  arr[a] = arr[b];
  arr[b] = t;
}


function findPack(packs, name) {
  for (let i = 0; i < packs.length; i++) {
    if (packs[i].name === name) {
      return i;
    }
  }
  return -1;
}

exports.getAll = async () => {
  return read();
};

exports.putAll = async (data) => {
  await write(data);
  return data;
};

exports.putPack = async ({ name, data }) => {
  const packs = await read();
  const idx = findPack(packs, name);
  if (idx !== -1) {
    packs[idx] = data;
    await write(packs);
  }
  return packs;
};

exports.swapPack = async ({ a, b }) => {
  const data = await read();
  swapArray(data, a, b);
  await write(data);
  return data;
};

exports.swapSticker = async ({ name, a, b }) => {
  const data = await read();
  const idx = findPack(data, name);
  if (idx !== -1) {
    swapArray(data[idx].stickers, a, b);
    await write(data);
  }
  return data;
};

exports.createPack = async ({name}) => {
  const data = await read();
  data.push({ name, stickers: [] });
  await write(data);
  return data;
};

exports.addSticker = async ({ name, sticker }) => {
  const data = await read();
  const idx = findPack(data, name);
  if (idx !== -1) {
    data[idx].stickers.push(sticker);
    await write(data);
  }
  return data;
};

exports.deletePack = async ({ name }) => {
  const data = await read();
  const idx = findPack(data, name);
  if (idx !== -1) {
    data.splice(idx, 1);
    await write(data);
  }
  return data;
};

exports.deleteSticker = async ({ name, index }) => {
  const data = await read();
  const idx = findPack(data, name);
  if (idx !== -1) {
    data[idx].stickers.splice(index, 1);
    await write(data);
  }
  return data;
};


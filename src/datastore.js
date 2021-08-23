const path = require('path');
const fs = require('fs').fsPromise;

const filename = path.join(__dirname, '../data.json');


const packs = [
  {
    name: '兔子',
    stickers: [
      {
        "body": "Carrot",
        "info": {
          "h": 200,
          "mimetype": "image/png",
          "size": 80625,
          "thumbnail_info": {
            "h": 200,
            "mimetype": "image/png",
            "size": 80625,
            "w": 142
          },
          "thumbnail_url": "mxc://matrix.org/kGJDCjMOgpLmZzbgknMTUHNm",
          "w": 142
        },
        "msgtype": "m.sticker",
        "url": "mxc://matrix.org/kGJDCjMOgpLmZzbgknMTUHNm",
        "id": "kGJDCjMOgpLmZzbgknMTUHNm"
      },
      {
        "body": "Chef",
        "info": {
          "h": 200,
          "mimetype": "image/png",
          "size": 88633,
          "thumbnail_info": {
            "h": 200,
            "mimetype": "image/png",
            "size": 88633,
            "w": 151
          },
          "thumbnail_url": "mxc://matrix.org/szaTExsJurtDBUUEeHHbhyqk",
          "w": 151
        },
        "msgtype": "m.sticker",
        "url": "mxc://matrix.org/szaTExsJurtDBUUEeHHbhyqk",
        "id": "szaTExsJurtDBUUEeHHbhyqk"
      },
    ],
  },
  {
    name: '猫',
    stickers: [
      {
        "body": "🎓",
        "url": "mxc://maunium.net/pxbCqPJNvcFIZlAyKCyXsqfJ",
        "info": {
        "w": 256,
        "h": 256,
        "size": 106237,
        "mimetype": "image/png",
        "thumbnail_url": "mxc://maunium.net/pxbCqPJNvcFIZlAyKCyXsqfJ",
        "thumbnail_info": {
        "w": 256,
        "h": 256,
        "size": 106237,
        "mimetype": "image/png"
        }
        },
        "net.maunium.telegram.sticker": {
        "pack": {
        "id": "551004416715522051",
        "short_name": "pusheen02"
        },
        "id": "551004416715522189",
        "emoticons": [
        "🎓"
        ]
        },
        "id": "tg-551004416715522189"
        },
    ],
  },
];

function read () {
  return packs;
  //return JSON.parse((await fs.readFile(filename)).toString());
}

function write (data) {
  //return fs.writeFile(filename, JSON.stringify(data, null, 2));
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
  return await read();
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


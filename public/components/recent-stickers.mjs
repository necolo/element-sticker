
import { useState } from 'preact/hooks';

const STORAGE_KEY = 'recentStickers';

const packIndex = {};
let initialized = false;
export function updatePackIndex (packs) {
    for (let i = 0; i < packs.length; i ++) {
        const pack = packs[i];
        const stickerIdx = packIndex[pack.name] = {};
        for (let j = 0; j < pack.stickers.length; j ++) {
            const sticker = pack.stickers[j];
            stickerIdx[sticker.id] = sticker;
        }
    }
    initialized = true;
}

function getStickersByName(arr) {
    const stickers = [];
    const newArr = [];
    for (const item of arr) {
        const { name, id } = item;
        const sticker = name in packIndex ? packIndex[name][id] : undefined;
        if (sticker) {
            stickers.push(sticker);
            newArr.push(item);
        }
    }
    return { stickers, newArr };
}

export function RecentStickerStore () {
    const [stickers, setStickers] = useState(JSON.parse(window.localStorage[STORAGE_KEY] || '[]'));

    const save = (newStickers) => {
        window.localStorage[STORAGE_KEY] = JSON.stringify(newStickers);
    };

    const updateRecentSticker = (idx) => {
        setStickers((oldStickers) => {
            const newStickers = oldStickers.slice();
            const sticker = newStickers.splice(idx, 1)[0];
            newStickers.unshift(sticker);
            save(newStickers);
            return newStickers;
        });
    };

    const addRecentSticker = (_packName, _sticker) => {
        let idx = -1;
        console.log('addRecentSticker', _packName, _sticker);
        for (let i = 0; i < stickers.length; i++) {
            const { name, id } = stickers[i];
            if (_packName === name && id === _sticker.id) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            updateRecentSticker(idx);
            return;
        }

        setStickers((oldStickers) => {
            const newStickers = oldStickers.slice();
            newStickers.unshift({
                name: _packName,
                id: _sticker.id,
            });
            save(newStickers);
            return newStickers;
        });
    };

    return {
        recentStickers: (() => {
            const data = getStickersByName(stickers);
            if (data.newArr.length !== stickers.length && initialized) {
                setStickers(data.newArr);
                save(data.newArr);
            }
            return data.stickers;
        })(),
        addRecentSticker,
        updateRecentSticker,
    };
}
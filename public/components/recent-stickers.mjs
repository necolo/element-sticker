
import { useState } from 'preact/hooks';

const STORAGE_KEY = 'recentStickers';

const packIndex = {};
export function updatePackIndex (packs) {
    for (let i = 0; i < packs.length; i ++) {
        const pack = packs[i];
        const stickerIdx = packIndex[pack.name] = {};
        for (let j = 0; j < pack.stickers.length; j ++) {
            const sticker = pack.stickers[j];
            stickerIdx[sticker.body] = sticker;
        }
    }
}

function getStickersByName(arr) {
    const stickers = [];
    const newArr = [];
    for (const item of arr) {
        const { packName, stickerName } = item;
        const sticker = packName in packIndex ? packIndex[packName][stickerName] : undefined;
        if (sticker) {
            stickers.push(sticker);
            newArr.push(item);
        }
    }
    return { stickers, newArr };
}

export function RecentStickerStore () {
    const [stickers, setStickers] = useState(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

    const save = (newStickers) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStickers));
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
        for (let i = 0; i < stickers.length; i++) {
            const { packName, stickerName } = stickers[i];
            if (_packName === packName && stickerName === _sticker.body) {
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
                packName: _packName,
                stickerName: _sticker.body,
            });
            save(newStickers);
            return newStickers;
        });
    };

    return {
        recentStickers: (() => {
            const data = getStickersByName(stickers);
            if (data.newArr.length !== stickers.length) {
                setStickers(data.newArr);
                save(data.newArr);
            }
            return data.stickers;
        })(),
        addRecentSticker,
        updateRecentSticker,
    };
}
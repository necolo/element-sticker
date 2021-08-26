import { useState } from 'preact/hooks';
import { makeThumbnailURL } from '../utils.mjs';
import { sendSticker } from '../message.mjs';
import { RecentStickerStore } from './recent-stickers.mjs';
import { useStore } from './store';
import { SettingStore } from './settings';
import { ModalStore } from './modal';

export const StickerPack = ({
    pack,
    isRecentList,
}) => {
    const [isFold, toggleFold] = useState(false); 
    const { updateRecentSticker, addRecentSticker } = useStore(RecentStickerStore);
    const setting = useStore(SettingStore);
    const modal = useStore(ModalStore, () => []);

    const { size, editMode } = setting;

    const handleFold = () => {
        toggleFold(!isFold);
    };

    const { stickers, name } = pack;
    const style = {
        width: size + 'px',
        height: size + 'px',
        marginRight: '8px',
        marginBottom: '8px',
        cursor: 'pointer',
        border: '1px solid #eee',
    };

    const isEditMode = editMode && !isRecentList;

    return <article id={name} className="panel is-primary" style={{
        marginBottom: '1rem',
    }}>
        <p className="panel-heading" style={{
            cursor: 'pointer',
            padding: '4px',
            fontSize: '0.75em',
        }} onClick={handleFold}>{name}</p>

        {!isFold &&
        <div className="panel-block" style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: isEditMode ? '#feecf0' : '',
        }}>
            {stickers.map((sticker, idx) => {
                return <img
                    className={`hover-shadow`}
                    key={sticker.id}
                    style={style}
                    alt={sticker.body}
                    width={sticker.w}
                    height={sticker.h}
                    src={makeThumbnailURL(sticker.url)}
                    onClick={() => {
                        if (isEditMode) {
                            modal.setStickerModal({
                                packName: name,
                                sticker,
                                stickerIndex: idx,
                            });
                        } else {
                            sendSticker(sticker);
                            if (isRecentList) {
                                updateRecentSticker(idx);
                            } else {
                                addRecentSticker(name, sticker);
                            }
                        }
                    }}
                />
            })}
            {!isRecentList &&
                <button onClick={() => {
                    modal.setStickerModal({
                        packName: name,
                        sticker: null, 
                        stickerIndex: -1,
                    })
                }} style={style}>+</button>
            }
        </div>
        }
    </article>;
}

export const RecentStickerPack = () => {
    const { recentStickers } = useStore(RecentStickerStore);
    return <StickerPack
        pack={{
            name: '最近',
            stickers: recentStickers,
        }}
        isRecentList
    />;
}
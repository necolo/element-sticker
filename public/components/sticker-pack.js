import { useState } from 'preact/hooks';
import { makeThumbnailURL } from '../utils.mjs';
import { sendSticker } from '../message.mjs';

export const StickerPack = ({
    pack,
    size,
    setUploadStickerOnPack,
}) => {
    const [isFold, toggleFold] = useState(false); 

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

    return <article id={name} className="panel is-primary">
        <p className="panel-heading" style={{
            cursor: 'pointer',
            padding: '4px',
            fontSize: '0.75em',
        }} onClick={handleFold}>{name}</p>

        {!isFold &&
        <div className="panel-block" style={{
            display: 'flex',
            flexWrap: 'wrap',
        }}>
            {stickers.map((sticker) => {
                return <img
                    key={sticker.id}
                    style={style}
                    alt={sticker.body}
                    width={sticker.w}
                    height={sticker.h}
                    src={makeThumbnailURL(sticker.url)}
                    onClick={() => {
                        sendSticker(sticker);
                    }}
                />
            })}
            <button onClick={() => {
                setUploadStickerOnPack(name);
            }} style={style}>+</button>
        </div>
        }
    </article>;
}
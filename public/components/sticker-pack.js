import { useState } from 'preact/hooks';
import { makeThumbnailURL } from '../utils.mjs';

export const StickerPack = ({
    pack,
    size,
}) => {
    const [isFold, toggleFold] = useState(false); 
    const handleFold = () => {
        toggleFold(!isFold);
    };
    const handleAddSticker = () => {

    }

    const { stickers, name } = pack;
    const style = {
        width: size + 'px',
        height: size + 'px',
        marginRight: '8px',
        cursor: 'pointer',
        border: '1px solid #eee',
    };

    return <article id={name} className="panel is-primary">
        <p className="panel-heading" style={{
            cursor: 'pointer',
            padding: '8px',
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
                />
            })}
            <button onClick={handleAddSticker} style={style}>+</button>
        </div>
        }
    </article>;
}
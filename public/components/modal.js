import { useState, useEffect } from 'preact/hooks';
import { api, upload, buildSticker } from '../utils.mjs';
import { Space } from './space';
import { useStore } from './store';
import { makeThumbnailURL } from '../utils.mjs';

export function ModalStore () {
    const [stickerModal, setStickerModal] = useState(null);

    return {
        stickerModal,
        setStickerModal,
        close: () => {
            setStickerModal(null);
        },
    };
}

export function StickerModal ({
    onUpdate,
}) {
    const modal = useStore(ModalStore);

    const [file, setFile] = useState(null);
    const [width, setWidth] = useState(64);
    const [ratio , setRatio] = useState(1);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const sticker = modal.stickerModal?.sticker;
        if (sticker) {
            setName(sticker.body);
            setWidth(sticker.info.w);
            setRatio(sticker.info.w / sticker.info.h);
        } else {
            setName('');
            setWidth(64);
            setRatio(1);
        }
        setFile(null);
        setError('');
    }, [modal.stickerModal]);

    if (!modal.stickerModal) {
        return null;
    }

    const { packName, sticker, stickerIndex } = modal.stickerModal;

    const handleAddSticker = async () => {
        try {
            const uploadRes = await upload(file);
            const url = uploadRes.content_uri;
            if (!url) { throw new Error('Cant get url from upload response'); }
            if (isNaN(width)) { throw new Error('Invalid width or height'); }
            if (!name) { throw new Error('Empty name'); }
            const height = Math.round(width / ratio);
            const stickerData = buildSticker(name, url, width, height);
            const res = await api('addSticker', {
                name: packName,
                sticker: stickerData,
            });
            onUpdate(res);
            modal.close();
        } catch (e) {
            setError(e.toString());
            console.error(e);
        }
    }

    const handleUpdateSticker = async () => {
        try {
            if (isNaN(width)) { throw new Error('Invalid width or height'); }
            if (!name) { throw new Error('Empty name'); }
            const height = Math.round(width / ratio);
            const stickerData = buildSticker(name, sticker?.url, width, height);
            const res = await api('updateSticker', {
                name: packName,
                sticker: stickerData,
                index: stickerIndex,
            });
            onUpdate(res);
            modal.close();
        } catch (e) {
            setError(e.toString());
            console.error(e)
        }
    };

    const handleDeleteSticker = async () => {
        try {
            const res = await api('deleteSticker', {
                name: packName,
                index: stickerIndex,
            });
            onUpdate(res);
            modal.close();
        } catch (e) {
            setError(e.toString());
            console.error(e);
        }
    };

    const renderSizeInput = () => {
        return <div className="field is-horizontal">
            <span>宽{width}</span>
            <Space dist={8} />
            <span>高{Math.round(width / ratio)}</span>
            <Space dist={8} />
            <p className="control">
                <input type="range"
                    style={{width: '128px'}}
                    value={width}
                    onInput={(ev) => setWidth(+ev.target.value)}
                    step={4}
                    min={16}
                    max={256}
                />
            </p>
        </div>;
    }
    const renderNameInput = () => {
        return <><p className="control">
            <a className="button is-static">
                名字
            </a>
        </p>
        <p className="control">
            <input
                className="input"
                type="text"
                value={name}
                onChange={(ev) => {
                    setName(ev.target.value);
                }}
            />
        </p></>;
    }

    let body = <></>;
    const height = Math.round(width / ratio);
    if (sticker) {
        // modify the sticker
        const isModified = (
            name !== '' &&
            width !== 0 &&
            (name !== sticker.body || 
            width !== sticker.info.w)
        );
        body = <>
            <p>修改 {packName}:{sticker.body} </p>
            <Space hori dist={8} />
            {renderSizeInput()}
            <div className="field has-addons">
                {renderNameInput()}
            </div>
            <div className="field has-addons">
                <div className="control">
                    <button className="button is-small is-primary"
                        onClick={handleUpdateSticker}
                        disabled={!isModified}
                        style={{width: '128px'}}
                    >
                        修改
                    </button>
                </div>
                <Space hori dist={16} />
                <div className="control">
                    <button className="button is-small is-danger"
                        onClick={handleDeleteSticker}
                    >
                        删除
                    </button>
                </div>
            </div>

            <img width={width} height={height}
                src={makeThumbnailURL(sticker.url)}
            />
        </>;
    } else {
        // upload new sticker
        body = <>
            <p>添加到: {packName}</p>
            <Space hori dist={8} />
            <File onUpload={(file) => {
                setFile(file);
                readImageSize(file).then(([w, h]) => {
                    const correctW = Math.min(256, w);
                    setWidth(correctW);
                    setRatio(w / h);
                })
            }} />
            <Space hori dist={8} />
            {file && <>
                {renderSizeInput()}
                <div className="field has-addons">
                    {renderNameInput()}
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-primary"
                            onClick={handleAddSticker}
                        >添加表情</button>
                    </div>
                </div>
                <Space hori dist={8} />
                <img width={width} height={height} 
                    src={window.URL.createObjectURL(file)}
                />
            </>}
        </>;
    }

    return <div className="modal is-active" style={{
        justifyContent: 'flex-start',
        paddingTop: '16px',
        color: 'white',
    }}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{
            width: '95%',
            maxHeight: '98%',
        }}>
            <Notification status="danger" text={error} />
            {body}
        </div>;
        <button className="modal-close is-large" aria-label="close" onClick={modal.close}></button>
    </div>;
}

function File ({onUpload}) {
    return <div className="file">
        <label className="file-label">
            <input class="file-input" type="file" name="resume"
                accept=".jpg, .jpeg, .png, .webp, .gif"
                onChange={(ev) => {
                    if (!ev.target.files) { return; }
                    const file = ev.target.files[0];
                    if (!file) { return; }
                    onUpload(file);
                }}
            ></input>
            <span className="file-cta" onClick={() => {

            }}>
                <span className="file-icon">
                    <i className="file-label"></i>
                </span>
                <span className="file-label">
                    选择文件
                </span>
            </span>
        </label>
    </div>;
}

function readImageSize(file) {
    const reader = new FileReader();
    const img = new Image();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = function () {
                resolve([
                    this.width,
                    this.height,
                ])
            };
        };
    });
}

function Notification ({
    status,
    text,
}) {
    const [hide, setHide] = useState(true);

    useEffect(() => {
        if (text) {
            setHide(false);
        } else {
            setHide(true);
        }
    }, [text]);

    if (hide) { return null; }

    return <div className={`notification is-${status}`}>
        <button className="delete" onClick={() => setHide(true)}></button>
        {text}
    </div>;
}
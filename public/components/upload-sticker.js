import { useState, useEffect } from 'preact/hooks';
import { api, upload, buildSticker } from '../utils.mjs';
import { Space } from './space';

export function UploadSticker ({
    packName,
    onClose,
}) {
    const [file, setFile] = useState(null);
    const [width, setWidth] = useState(64);
    const [ratio , setRatio] = useState(1);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

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
            onClose(res);
        } catch (e) {
            setError(e.toString());
            console.error(e);
        }
    }

    return <div className="modal is-active" style={{
        justifyContent: 'flex-start',
        paddingTop: '16px',
    }}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{
            width: '95%',
        }}>
            <Notification status="danger" text={error} />

            <p style={{color: 'white'}}>添加到: {packName}</p>
            <File onUpload={(file) => {
                setFile(file);
                readImageSize(file).then(([w, h]) => {
                    const correctW = Math.min(256, w);
                    setWidth(correctW);
                    setRatio(correctW / h);
                })
            }} />
            <Space hori dist={8} />
            {file && <>
                <div className="field is-horizontal" style={{color: 'white'}}>
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
                </div>
                <div className="field has-addons">
                    <p className="control">
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
                    </p>
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-primary"
                            onClick={handleAddSticker}
                        >添加表情</button>
                    </div>
                </div>
                <img width={width} height={Math.round(width / ratio)} 
                    src={window.URL.createObjectURL(file)}
                />
                <Space hori dist={8} />
            </>}

        </div>;
        <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
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
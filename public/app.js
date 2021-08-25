import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { StickerPack } from './components/sticker-pack';
import { Tabs } from './components/tab';
import { PanelBlock, AddStickerPack, ThemeSelector } from './components/panel-block';
import { UploadSticker } from './components/upload-sticker';
import { api } from './utils.mjs';

function App () {
    const [packs, setPack] = useState([]);
    const [size, setSize] = useState(+(localStorage.getItem('size') || 64));
    const [uploadStickerOnPack, setUploadStickerOnPack] = useState('');
    // const [onTheme, setTheme] = useState(localStorage.getItem('theme') || 'light-green');

    useEffect(() => {
        api('getAll').then((res) => {
            setPack(res);
        }).catch(console.error);
    }, []);

    return <div style={{position: 'relative'}}>
        <Tabs
            names={packs.map((pack) => pack.name)}
        />
        {packs.map((pack) => {
            return <StickerPack
                key={pack.name}
                pack={pack}
                size={size}
                setUploadStickerOnPack={setUploadStickerOnPack}
            />
        })}

        {uploadStickerOnPack && <UploadSticker
            packName={uploadStickerOnPack}
            onClose={(data) => {
                if (data) {
                    setPack(data);
                }
                setUploadStickerOnPack('');
            }}
        />}

        <article className="panel is-info">
            <p className="panel-heading" style={{
                padding: '8px',
            }}>Setting</p>
            <PanelBlock title="Size">
                <input type="range"
                    style={{width: '80%'}}
                    value={size}
                    min={16}
                    max={128}
                    step={4}
                    onInput={(ev) => {
                        const v = +ev.target.value;
                        setSize(v);
                        localStorage.setItem('size', v);
                    }}
                />
            </PanelBlock>
            <AddStickerPack
                onAdd={(name) => {
                    api('createPack', {name}).then((res) => {
                        setPack(res);
                    }).catch(console.error);
                }}
                onDelete={(name) => {
                    api('deletePack', {name}).then((res) => {
                        setPack(res);
                    }).catch(console.error);
                }}
            />
            <ThemeSelector
                onTheme={(theme) => {}}
            />
        </article>
    </div>;
}



render(<App />, document.body);
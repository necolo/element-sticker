import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { StickerPack } from './components/sticker-pack';
import { Tabs } from './components/tab';
import { PanelBlock, AddStickerPack, ThemeSelector } from './components/panel-block';
import { api } from './utils.mjs';

function App () {
    const [packs, setPack] = useState([]);
    const [size, setSize] = useState(+(localStorage.getItem('size') || 64));
    // const [onTheme, setTheme] = useState(localStorage.getItem('theme') || 'light-green');

    useEffect(() => {
        api('getAll').then((res) => {
            setPack(res);
        }).catch(console.error);
    }, []);

    if (!packs.length) {
        return <h1>Loading...</h1>;
    }

    return <div style={{position: 'relative'}}>
        <Tabs
            names={packs.map((pack) => pack.name)}
        />
        {packs.map((pack) => {
            return <StickerPack
                key={pack.name}
                pack={pack}
                size={size}
            />
        })}

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
                    onChange={(ev) => {
                        const v = +ev.target.value;
                        setSize(v);
                        localStorage.setItem('size', v);
                    }}
                />
            </PanelBlock>
            <AddStickerPack
                onAdd={(name) => {
                    setPack((oldPacks) => oldPacks.concat({
                        name,
                        stickers: [],
                    }));
                }}
                onDelete={(name) => {
                }}
            />
            <ThemeSelector
                onTheme={(theme) => {}}
            />
        </article>
    </div>;
}



render(<App />, document.body);
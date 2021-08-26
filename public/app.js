import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { StickerPack, RecentStickerPack } from './components/sticker-pack';
import { Tabs } from './components/tab';
import { StickerModal, ModalStore } from './components/modal';
import { api } from './utils.mjs';
import { RecentStickerStore, updatePackIndex } from './components/recent-stickers.mjs';
import { ComposedProvider } from './components/store.js';
import { SettingStore, Settings } from './components/settings';

function App () {
    const [packs, setPack] = useState([]);

    const updatePack = (newPacks) => {
        setPack(newPacks);
        updatePackIndex(newPacks);
    }

    useEffect(() => {
        api('getAll').then((res) => {
            updatePack(res);
        }).catch(console.error);
    }, []);

    const names = packs.map((pack) => pack.name);
    names.unshift('最近');
    names.push('设置');

    const body = <div style={{position: 'relative'}}>
        <Tabs names={names} />

        <RecentStickerPack />

        {packs.map((pack) => {
            return <StickerPack
                key={pack.name}
                pack={pack}
            />
        })}

        <StickerModal onUpdate={(data) => updatePack(data)} />
        <Settings onUpdate={updatePack} />
    </div>;

    return <ComposedProvider stores={[
        { store: ModalStore },
        { store: RecentStickerStore },
        { store: SettingStore },
    ]}>
        {body}
    </ComposedProvider>;
}

render(<App />, document.body);
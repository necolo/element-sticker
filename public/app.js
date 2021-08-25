import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { StickerPack } from './components/sticker-pack';
import { Tabs } from './components/tab';
import { ThemeSelector } from './components/theme';
import { api } from './utils.mjs';

const testData = [
    {
      name: '兔子',
      stickers: [
        {
          "body": "Carrot",
          "info": {
            "h": 200,
            "mimetype": "image/png",
            "size": 80625,
            "thumbnail_info": {
              "h": 200,
              "mimetype": "image/png",
              "size": 80625,
              "w": 142
            },
            "thumbnail_url": "mxc://matrix.org/kGJDCjMOgpLmZzbgknMTUHNm",
            "w": 142
          },
          "msgtype": "m.sticker",
          "url": "mxc://matrix.org/kGJDCjMOgpLmZzbgknMTUHNm",
          "id": "kGJDCjMOgpLmZzbgknMTUHNm"
        },
        {
          "body": "Chef",
          "info": {
            "h": 200,
            "mimetype": "image/png",
            "size": 88633,
            "thumbnail_info": {
              "h": 200,
              "mimetype": "image/png",
              "size": 88633,
              "w": 151
            },
            "thumbnail_url": "mxc://matrix.org/szaTExsJurtDBUUEeHHbhyqk",
            "w": 151
          },
          "msgtype": "m.sticker",
          "url": "mxc://matrix.org/szaTExsJurtDBUUEeHHbhyqk",
          "id": "szaTExsJurtDBUUEeHHbhyqk"
        },
      ],
    },
    {
      name: '猫',
      stickers: [
        {
          "body": "🎓",
          "url": "mxc://maunium.net/pxbCqPJNvcFIZlAyKCyXsqfJ",
          "info": {
          "w": 256,
          "h": 256,
          "size": 106237,
          "mimetype": "image/png",
          "thumbnail_url": "mxc://maunium.net/pxbCqPJNvcFIZlAyKCyXsqfJ",
          "thumbnail_info": {
          "w": 256,
          "h": 256,
          "size": 106237,
          "mimetype": "image/png"
          }
          },
          "net.maunium.telegram.sticker": {
          "pack": {
          "id": "551004416715522051",
          "short_name": "pusheen02"
          },
          "id": "551004416715522189",
          "emoticons": [
          "🎓"
          ]
          },
          "id": "tg-551004416715522189"
          },
      ],
    },
  ];

function App () {
    const [packs, setPack] = useState([]);
    const [size, setSize] = useState(+(localStorage.getItem('size') || 64));
    const [onTheme, setTheme] = useState(localStorage.getItem('theme') || 'light-green');

    useEffect(() => {
        setPack(testData);
        // api('getAll').then((res) => {
        //     setPack(res);
        // }).catch(console.error);
    }, []);

    if (!packs.length) {
        return <h1>Loading...</h1>;
    }

    return <div>
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
        </article>

        {/* <section>
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
            <ThemeSelector onTheme={(theme) => {}} />
        </section> */}
    </div>;
}

function PanelBlock ({title, children}) {
    return <div className="panel-block" style={{
        display: 'flex',
    }}>
        {title}
        {children}
    </div>;
}

function AddStickerPack ({
    onAdd,
    onDelete,
}) {
    const [name, setName] = useState('');
    return <div>
        <span>添加新表情包名字</span>
        <input type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
        />
        <button onClick={() => {
            onAdd(name);
            setName('');
        }}>添加</button>
        <button onClick={() => {
            onDelete(name);
            setName('');
        }}>删除</button>
    </div>;
}

render(<App />, document.body);
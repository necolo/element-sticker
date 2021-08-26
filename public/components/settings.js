import { useState } from 'preact/hooks';
import { useStore } from './store';
import { Space } from './space';

export function SettingStore() {
    const [editMode, setEditMode] = useState(false);
    const [size, setSize] = useState(+(localStorage.getItem('size') || 64));

    return {
        editMode,
        setEditMode,
        size,
        setSize: (v) => {
            setSize(v);
            localStorage.setItem('size', v);
        },
    }
}

export function Settings() {
    const setting = useStore(SettingStore);
    const [show, setShow] = useState(true);

    return <article className="panel is-info">
        <p id="设置"
            className="panel-heading"
            style={{
                padding: '4px',
                fontSize: '0.75em',
                cursor: 'pointer',
            }}
            onClick={() => setShow(!show)}
        >设置</p>

        {show && <>
            <PanelBlock title="Size">
                <input type="range"
                    style={{width: '80%'}}
                    value={setting.size}
                    min={16}
                    max={128}
                    step={4}
                    onInput={(ev) => {
                        const v = +ev.target.value;
                        setting.setSize(v);
                    }}
                />
            </PanelBlock>
            <PanelBlock title="">
                <button className={`button is-small is-light ${setting.editMode ? 'is-danger' : 'is-primary'}`}
                    onClick={() => {
                        setting.setEditMode(!setting.editMode);
                    }}
                >
                    { setting.editMode ? '退出编辑模式' : '进入编辑模式' }
                </button>
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
            {/* <ThemeSelector
                onTheme={(theme) => {}}
            /> */}
            <PanelBlock title="">
                <button className="button is-small" onClick={() => {
                    location.reload();
                }}>Reload</button>
            </PanelBlock>
        </>}
    </article>;
}

export function PanelBlock ({title, children}) {
    return <div className="panel-block" style={{
        display: 'flex',
    }}>
        <span>{title}</span>
        <Space dist={8} />
        {children}
    </div>;
}

export function AddStickerPack ({
    onAdd,
    onDelete,
}) {
    const [name, setName] = useState('');
    return <PanelBlock title="">
        <input type="text"
            placeholder="表情包名字"
            className="input is-small"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            style={{width: '120px'}}
        />
        <Space dist={4} />
        <button className="button is-small is-primary"
            onClick={() => {
                onAdd(name);
                setName('');
            }}
        >添加</button>
        <Space dist={4} />
        <button
            className="button is-small is-danger"
            onClick={() => {
                onDelete(name);
                setName('');
            }}
        >删除</button>
    </PanelBlock>;
}

const Themes = [
    'light-green',
];

export function ThemeSelector ({
    onTheme,
}) {
    return <PanelBlock title="Theme">
        <div className="select is-primary is-small">
            <select
                onChange={(ev) => {
                    console.log(ev);
                }}
            >
                {Themes.map((theme) => <option key={theme}>{theme}</option>)}
            </select>
        </div>
    </PanelBlock>;
}

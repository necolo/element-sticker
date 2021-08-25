import { useState } from 'preact/hooks';
import { Space } from './space';

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
    return <PanelBlock title="管理表情包">
        <input type="text"
            className="input is-small"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            style={{width: '120px'}}
        />
        <Space dist={8} />
        <button className="button is-small is-primary"
            onClick={() => {
                onAdd(name);
                setName('');
            }}
        >添加</button>
        <Space dist={8} />
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
    return null;
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

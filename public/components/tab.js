import { useState } from 'preact/hooks';

export function Tabs ({
    names,
}) {
    const [onName, setOnName] = useState(names[0]);

    return <div className="tabs is-centered my-box-shadow" style={{
        position: 'sticky',
        top: '0',
        backgroundColor: 'white',
    }}>
        <ul>
            {names.map((name) => {
                const isActive = onName === name;
                return <li
                    key={name}
                    className={isActive ? 'is-active' : ''}
                    onClick={() => {
                        setOnName(onName);
                    }}
                ><a href={`#${name}`}>{name}</a></li>
            })}
        </ul>
    </div>;
}
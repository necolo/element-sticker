import { useState } from 'preact/hooks';

export function Tabs ({
    names,
}) {
    const [onName, setOnName] = useState(names[0]);

    return <div className="tabs is-centered">
        <ul>
            {names.map((name) => {
                const isActive = onName === name;
                return <li
                    key={name}
                    className={isActive ? 'is-active' : ''}
                    onClick={() => {
                        setOnName(onName);
                    }}
                ><a>{name}</a></li>
            })}
        </ul>
    </div>;
}
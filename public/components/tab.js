import { useState } from 'preact/hooks';

const isMobileSafari = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
const scrollToSection = (evt, id) => {
	const pack = document.getElementById(`pack-${id}`)
	pack.scrollIntoView({ block: "start", behavior: "instant" })
	evt.preventDefault()
}

export function Tabs ({
    names,
}) {
    const [onName, setOnName] = useState(names[0]);

    return <div className="tabs my-box-shadow" style={{
        position: 'sticky',
        top: '0',
        backgroundColor: 'white',
        fontSize: '.75rem',
        marginBottom: '1rem',
    }}>
        <ul>
            {names.map((name) => {
                const isActive = onName === name;
                return <li
                    key={name}
                    className={isActive ? 'is-active' : ''}
                    onClick={() => {
                        setOnName(name);
                    }}
                >
                    <a href={`#${name}`}
                        onClick={isMobileSafari ? (ev) => {
                            scrollToSection(ev, name);
                        } : undefined}
                    >{name}</a>
                </li>
            })}
        </ul>
    </div>;
}
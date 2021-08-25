const Themes = [
    'light-green',
];

export function ThemeSelector ({
    onTheme,
}) {
    return <div className="select is-primary is-small">
        <select
            onChange={(ev) => {
                console.log(ev);
            }}
        >
            {Themes.map((theme) => <option key={theme}>{theme}</option>)}
        </select>
    </div>;
}

export function Space ({
    dist,
    hori,
}) {
    const style = {
        display: 'block',
    };
    if (hori) {
        style['marginTop'] = dist + 'px'; 
    } else {
        style['marginLeft'] = dist + 'px';
    }
    return <span style={style}></span>;
}
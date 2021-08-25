export const makeThumbnailURL = (mxc) => 
    `/mxc/${mxc.substr(6)}?height=128&width=128&method=scale`


export async function api(action, data) {
    const res = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify({action, data}),
    });
    return res.json();
}
    
export async function upload(data) {
    const res = await fetch('/api/upload', {
        method: 'POST',
        body: data, // 这块你看看用什么方法比较合适
    });
    return res.json();
}
export const makeThumbnailURL = (mxc) =>
    `/mxc/${mxc.substr(6)}?height=128&width=128&method=scale`

export async function api(action, data) {
    const res = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify({
            action,
            data
        }),
    });
    return res.json();
}

export async function upload(data) {
    const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
    });
    return res.json();
}

export function buildSticker(name, url, w, h, mimetype) {
    return {
        id: url.match(/\/([^\/]+)$/)[1],
        body: name,
        url,
        info: {
            w,
            h,
            mimetype,
            thumbnail_url: url,
            thumbnail_info: {
                w,
                h,
                mimetype,
            },
        },
    };
}
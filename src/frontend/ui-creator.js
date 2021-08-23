/**
 * A group of stick
 * @param {*} name 
 * @param {*} content for special section, eg. settings 
 * @returns 
 */
export function createSection (name, content) {
    const section = document.createElement('section');
    section.classname = 'sticker-section';

    const title = document.createElement('h3');
    title.value = name;
    section.appendChild(title);
    section.appendChild(content);

    return section;
}

export function createList (stickers) {
    const list = document.createElement('div');
    list.classname = 'sticker-list';
    return list;
}

export function createSticker (id, src) {
    const img = document.createElement('img');
    img.src = src;
    img.id = id;
    img.width = 32;
    img.height = 32;
    return img;
}
import * as ui from './ui-creator';

async function render () {
    const app = document.querySelector('#app');
}

if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
        render().catch(console.error);
    }, false);
}
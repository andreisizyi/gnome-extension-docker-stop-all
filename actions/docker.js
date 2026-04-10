import * as Main from 'resource:///org/gnome/shell/ui/main.js';

function showPlaceholder(message) {
    Main.notify('Docker Hot Actions', message);
}

export function dockerStopAll() {
    showPlaceholder('TODO: docker stop all');
}

export function dockerStart() {
    showPlaceholder('TODO: docker start');
}

import {dockerStart, dockerStopAll} from '../actions/docker.js';

export function getMenuItems() {
    return [
        {
            label: 'Docker Stop All',
            activate: dockerStopAll,
        },
        {
            label: 'Docker Start',
            activate: dockerStart,
        },
    ];
}

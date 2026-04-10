import {dockerStopAll} from '../actions/docker-stop.js';

export function getMenuItems() {
    return [
        {
            label: 'Stop All',
            activate: dockerStopAll,
        },
        // {
        //    label: 'Start',
        //    activate: dockerStart,
        // },
    ];
}

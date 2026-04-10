import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {
    NO_RUNNING_CONTAINERS_MESSAGE,
    ensureDockerRunning,
    execDockerCommand,
    listRunningContainers,
} from './docker-client.js';

function showNotification(message) {
    Main.notify('Docker Hot Actions', message);
}

export async function dockerStopAll() {
    try {
        await ensureDockerRunning();
        const containers = await listRunningContainers();

        if (containers.length === 0) {
            showNotification(NO_RUNNING_CONTAINERS_MESSAGE);
            return;
        }

        await execDockerCommand(['stop', ...containers.map(container => container.id)]);
        showNotification('Stopped running containers');
    } catch (error) {
        console.error(error);
        showNotification(error.message);
    }
}

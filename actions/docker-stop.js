import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {
    DOCKER_STOP_FAILED_MESSAGE,
    NO_RUNNING_CONTAINERS_MESSAGE,
    ensureDockerRunning,
    execDockerCommand,
    getDockerUserMessage,
    listRunningContainers,
} from './docker-client.js';

const NOTIFICATION_TITLE = 'Docker Stop All';
const SUCCESS_STOPPED_MESSAGE = 'Stopped running containers';

function showNotification(message) {
    Main.notify(NOTIFICATION_TITLE, message);
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
        showNotification(SUCCESS_STOPPED_MESSAGE);
    } catch (error) {
        showNotification(getDockerUserMessage(error, DOCKER_STOP_FAILED_MESSAGE));
    }
}

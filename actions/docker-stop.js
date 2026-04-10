import Gio from 'gi://Gio';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

const DOCKER_BIN = '/usr/bin/docker';

function showNotification(message) {
    Main.notify('Docker Hot Actions', message);
}

async function execCommand(argv) {
    const proc = new Gio.Subprocess({
        argv,
        flags: Gio.SubprocessFlags.STDOUT_PIPE |
            Gio.SubprocessFlags.STDERR_PIPE,
    });

    proc.init(null);

    const [stdout, stderr] = await proc.communicate_utf8_async(null, null);
    const status = proc.get_exit_status();

    if (status !== 0) {
        throw new Error(
            stderr.trim() ||
            stdout.trim() ||
            `Command failed: ${argv.join(' ')}`
        );
    }

    return stdout.trim();
}

async function checkDockerRunning() {
    try {
        await execCommand([DOCKER_BIN, 'info']);
        return true;
    } catch (error) {
        console.error(error);
        showNotification('Docker is not running');
        return false;
    }
}

async function getRunningContainers() {
    const output = await execCommand([DOCKER_BIN, 'ps', '-q']);

    if (!output)
        return [];

    return output
        .split('\n')
        .map(container => container.trim())
        .filter(Boolean);
}

export async function dockerStopAll() {
    if (!await checkDockerRunning())
        return;

    try {
        const containers = await getRunningContainers();

        if (containers.length === 0) {
            showNotification('No running containers');
            return;
        }

        await execCommand([DOCKER_BIN, 'stop', ...containers]);
        showNotification('Stopped running containers');
    } catch (error) {
        console.error(error);
        showNotification(error.message);
    }
}

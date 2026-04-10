import Gio from 'gi://Gio';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

const DOCKER_BIN = '/usr/bin/docker';
const RUNNING_CONTAINERS_FORMAT = '{{.ID}}\t{{.Names}}';

export const DOCKER_NOT_RUNNING_MESSAGE = 'Docker is not running';
export const NO_RUNNING_CONTAINERS_MESSAGE = 'No running containers';

export async function execDockerCommand(argv) {
    const proc = new Gio.Subprocess({
        argv: [DOCKER_BIN, ...argv],
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
            `Command failed: ${DOCKER_BIN} ${argv.join(' ')}`
        );
    }

    return stdout.trim();
}

export async function ensureDockerRunning() {
    try {
        await execDockerCommand(['info']);
    } catch (error) {
        console.error(error);
        throw new Error(DOCKER_NOT_RUNNING_MESSAGE);
    }
}

export async function listRunningContainers() {
    const output = await execDockerCommand([
        'ps',
        '--format',
        RUNNING_CONTAINERS_FORMAT,
    ]);

    if (!output)
        return [];

    return output
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const [id = '', name = ''] = line.split('\t');

            return {
                id: id.trim(),
                name: name.trim(),
            };
        });
}

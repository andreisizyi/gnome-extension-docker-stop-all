import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

const DEFAULT_DOCKER_COMMAND = 'docker';
const RUNNING_CONTAINERS_FORMAT = '{{.ID}}\t{{.Names}}';

let dockerSettings = null;

export const DOCKER_NOT_FOUND_MESSAGE = 'Docker CLI not found';
export const DOCKER_COMMAND_INVALID_MESSAGE = 'Docker command from settings is invalid';
export const DOCKER_NOT_RUNNING_MESSAGE = 'Docker is not running';
export const NO_RUNNING_CONTAINERS_MESSAGE = 'No running containers';

export function setDockerSettings(settings) {
    dockerSettings = settings;
}

function resolveExecutable(command) {
    if (!command)
        return null;

    if (GLib.path_is_absolute(command) &&
        GLib.file_test(command, GLib.FileTest.IS_EXECUTABLE))
        return command;

    return GLib.find_program_in_path(command);
}

function resolveDockerCommand() {
    const fromSettings = dockerSettings?.get_string('docker-command')?.trim();
    if (fromSettings) {
        const discoveredFromSettings = resolveExecutable(fromSettings);
        return discoveredFromSettings;
    }

    const discoveredDefault = resolveExecutable(DEFAULT_DOCKER_COMMAND);
    if (discoveredDefault)
        return discoveredDefault;

    return null;
}

function getDockerCommandOrThrow() {
    const fromSettings = dockerSettings?.get_string('docker-command')?.trim();
    const dockerCommand = resolveDockerCommand();
    if (!dockerCommand && fromSettings)
        throw new Error(DOCKER_COMMAND_INVALID_MESSAGE);

    if (!dockerCommand)
        throw new Error(DOCKER_NOT_FOUND_MESSAGE);

    return dockerCommand;
}

export async function execDockerCommand(argv) {
    const dockerCommand = getDockerCommandOrThrow();
    const proc = new Gio.Subprocess({
        argv: [dockerCommand, ...argv],
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
            `Command failed: ${dockerCommand} ${argv.join(' ')}`
        );
    }

    return stdout.trim();
}

export async function ensureDockerRunning() {
    try {
        await execDockerCommand(['info']);
    } catch (error) {
        if (error.message === DOCKER_NOT_FOUND_MESSAGE ||
            error.message === DOCKER_COMMAND_INVALID_MESSAGE)
            throw error;

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

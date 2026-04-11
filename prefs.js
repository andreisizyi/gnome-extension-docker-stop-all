import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const SETTINGS_KEY_DOCKER_COMMAND = 'docker-command';
const PLACEHOLDER_DOCKER_COMMAND = 'docker';

export default class DockerHotActionsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: 'Docker',
            description: 'Optionally override the Docker command or absolute path.',
        });

        const row = new Adw.EntryRow({
            title: 'Docker command',
        });
        if (typeof row.set_placeholder_text === 'function')
            row.set_placeholder_text(PLACEHOLDER_DOCKER_COMMAND);

        settings.bind(SETTINGS_KEY_DOCKER_COMMAND, row, 'text', Gio.SettingsBindFlags.DEFAULT);

        group.add(row);
        page.add(group);
        window.add(page);
    }
}

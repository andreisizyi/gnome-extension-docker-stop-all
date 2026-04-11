import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class DockerHotActionsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: 'Docker',
            description: 'Optional override for Docker CLI command or absolute path.',
        });

        const row = new Adw.EntryRow({
            title: 'Docker command or path',
        });
        if (typeof row.set_placeholder_text === 'function')
            row.set_placeholder_text('docker');

        settings.bind('docker-command', row, 'text', Gio.SettingsBindFlags.DEFAULT);

        group.add(row);
        page.add(group);
        window.add(page);
    }
}

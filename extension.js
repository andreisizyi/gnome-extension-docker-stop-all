import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {setDockerSettings} from './actions/docker-client.js';
import {DockerHotActionsIndicator} from './ui/indicator.js';

export default class DockerHotActionsExtension extends Extension {
    enable() {
        setDockerSettings(this.getSettings());
        this._indicator = new DockerHotActionsIndicator();
        Main.panel.addToStatusArea('docker-hot-actions', this._indicator, 1, 'left');
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
        setDockerSettings(null);
    }
}

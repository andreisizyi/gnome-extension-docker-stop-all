import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {setDockerSettings} from './actions/docker-client.js';
import {DockerHotActionsIndicator} from './ui/indicator.js';

const STATUS_AREA_NAME = 'docker-hot-actions';
const STATUS_AREA_POSITION = 1;
const STATUS_AREA_BOX = 'left';

export default class DockerHotActionsExtension extends Extension {
    enable() {
        setDockerSettings(this.getSettings());
        this._indicator = new DockerHotActionsIndicator();
        Main.panel.addToStatusArea(
            STATUS_AREA_NAME,
            this._indicator,
            STATUS_AREA_POSITION,
            STATUS_AREA_BOX
        );
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
        setDockerSettings(null);
    }
}

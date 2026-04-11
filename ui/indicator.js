import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import {buildIndicatorMenu} from '../menu/items.js';

const INDICATOR_ICON_NAME = 'application-x-appliance-symbolic';

function buildIndicatorActor() {
    return {
        actor: new St.Icon({
            icon_name: INDICATOR_ICON_NAME,
            icon_size: 16,
            style_class: 'system-status-icon',
            y_align: Clutter.ActorAlign.CENTER,
        }),
        isCompact: true,
    };
}

export const DockerHotActionsIndicator = GObject.registerClass(
class DockerHotActionsIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Docker Hot Actions');

        const {actor, isCompact} = buildIndicatorActor();

        if (isCompact)
            this.add_style_class_name('docker-hot-actions-button');

        this.add_child(actor);
        buildIndicatorMenu(this.menu);
    }
});

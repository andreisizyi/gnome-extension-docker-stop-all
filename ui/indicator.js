import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {getMenuItems} from '../menu/items.js';

const INDICATOR_ICON_NAME = 'package-x-generic-symbolic';
const INDICATOR_ICON_PATH =
    '/usr/share/icons/Adwaita/symbolic/mimetypes/package-x-generic-symbolic.svg';

function getAvailableIconName() {
    if (Gio.File.new_for_path(INDICATOR_ICON_PATH).query_exists(null))
        return INDICATOR_ICON_NAME;

    return null;
}

function buildIndicatorActor() {
    const iconName = getAvailableIconName();

    if (iconName) {
        return {
            actor: new St.Icon({
                icon_name: iconName,
                icon_size: 16,
                style_class: 'system-status-icon',
                y_align: Clutter.ActorAlign.CENTER,
            }),
            isCompact: true,
        };
    }

    return {
        actor: new St.Label({
            text: 'Docker Control',
            y_align: Clutter.ActorAlign.CENTER,
        }),
        isCompact: false,
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
        this._addMenuItems();
    }

    _addMenuItems() {
        for (const itemConfig of getMenuItems()) {
            const menuItem = new PopupMenu.PopupMenuItem(itemConfig.label);

            menuItem.connect('activate', () => {
                itemConfig.activate();
            });

            this.menu.addMenuItem(menuItem);
        }
    }
});

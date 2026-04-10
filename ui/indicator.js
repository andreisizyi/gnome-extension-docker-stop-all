import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {getMenuItems} from '../menu/items.js';

export const DockerHotActionsIndicator = GObject.registerClass(
class DockerHotActionsIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Docker Hot Actions');

        const label = new St.Label({
            text: 'hello',
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.add_child(label);
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

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {
    DOCKER_NOT_RUNNING_MESSAGE,
    NO_RUNNING_CONTAINERS_MESSAGE,
    ensureDockerRunning,
    getDockerUserMessage,
    listRunningContainers,
} from '../actions/docker-client.js';
import {dockerStopAll} from '../actions/docker-stop.js';

const STOP_ICON_NAME = 'media-playback-stop-symbolic';
const STOP_ICON_SIZE = 14;

const MENU_LABELS = {
    loading: 'Loading...',
    stopAllContainers: 'Stop all containers',
};

function addDisabledItem(menu, label) {
    const item = new PopupMenu.PopupMenuItem(label);
    item.setSensitive(false);
    menu.addMenuItem(item);
}

function addContainerInfoItem(menu, label, isLast = false) {
    const item = new PopupMenu.PopupMenuItem(label);
    item.setSensitive(false);
    item.add_style_class_name('docker-hot-actions-container-item');

    if (isLast)
        item.add_style_class_name('docker-hot-actions-container-item-last');

    menu.addMenuItem(item);
}

function addStopAllItem(menu) {
    const stopAllItem = new PopupMenu.PopupImageMenuItem(
        MENU_LABELS.stopAllContainers,
        STOP_ICON_NAME
    );

    const icon = stopAllItem.icon ?? stopAllItem._icon;
    if (icon)
        icon.icon_size = STOP_ICON_SIZE;

    stopAllItem.connect('activate', () => {
        void dockerStopAll();
    });

    menu.addMenuItem(stopAllItem);
}

function resetIndicatorMenu(menu) {
    menu.removeAll();
    addStopAllItem(menu);
    menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
}

function sortContainersByName(containers) {
    return [...containers].sort((a, b) => a.name.localeCompare(b.name));
}

function renderContainerItems(menu, containers) {
    const sortedContainers = sortContainersByName(containers);

    sortedContainers.forEach((container, index) => {
        addContainerInfoItem(
            menu,
            container.name,
            index === sortedContainers.length - 1
        );
    });
}

async function refreshIndicatorMenu(menu, refreshState) {
    const refreshVersion = refreshState.version;

    resetIndicatorMenu(menu);
    addDisabledItem(menu, MENU_LABELS.loading);

    try {
        await ensureDockerRunning();
        const containers = await listRunningContainers();

        if (refreshVersion !== refreshState.version)
            return;

        resetIndicatorMenu(menu);

        if (containers.length === 0) {
            addDisabledItem(menu, NO_RUNNING_CONTAINERS_MESSAGE);
            return;
        }

        renderContainerItems(menu, containers);
    } catch (error) {
        if (refreshVersion !== refreshState.version)
            return;

        resetIndicatorMenu(menu);
        addDisabledItem(menu, getDockerUserMessage(error, DOCKER_NOT_RUNNING_MESSAGE));
    }
}

export function buildIndicatorMenu(menu) {
    const refreshState = {version: 0};

    resetIndicatorMenu(menu);
    addDisabledItem(menu, MENU_LABELS.loading);

    menu.connect('open-state-changed', (_menu, open) => {
        if (!open)
            return;

        refreshState.version += 1;
        void refreshIndicatorMenu(menu, refreshState);
    });
}

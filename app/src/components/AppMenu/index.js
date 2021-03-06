import * as React from 'react';
import store from 'modules';
import { ReactComponent as PreferencesIcon } from 'icons/preferences.svg';
import styles from './styles.module.css';
import { openShortcuts } from 'modules/selectedScreen';

import { set, removeCompletedTodos } from 'modules/task';

import {
  isElectron,
  openMenu,
  closeApp,
  readStoreFromFile,
  writeStoreToFile,
} from 'utils/electron';

export default function AppClose() {
  if (!isElectron) {
    return null;
  }

  return <PreferencesIcon className={styles.button} onClick={openAppMenu} />;
}

function openAppMenu() {
  openMenu([
    {
      label: 'Task Open...',
      click: async () => {
        const newStore = await readStoreFromFile();

        if (newStore) {
          store.dispatch(set(newStore.task));
        }
      },
    },
    {
      label: 'Task Save As...',
      click: () => writeStoreToFile(store.getState()),
    },
    {
      type: 'separator',
    },
    {
      label: 'Clear Completed Todos',
      click: () => store.dispatch(removeCompletedTodos()),
    },
    {
      label: 'Show Shortcuts',
      click: () => store.dispatch(openShortcuts()),
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: closeApp,
    },
  ]);
}

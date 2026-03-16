import { createSettingsStore } from '@netflix-internal/xd-settings';
import {
  motionSettings,
  designSettings,
  trailerSettings,
} from './settings-eclipse.js';

// Mapping the MotionSettings object to the desired structure
const mapSettings = (settings, show) =>
  Object.entries(settings).reduce((acc, [group, properties]) => {
    Object.entries(properties).forEach(([property, value]) => {
      acc[property] = show ? { ...value, group } : { ...value, hidden: !show };
    });
    return acc;
  }, {});

// Project Specific Settings
const projectSettings = {
  showHelpers: {
    initial: true,
  },
  actionableToastDelay: {
    initial: 2000,
    suffix: 'ms',
  },
  actionableToastDuration: {
    initial: 8000,
    suffix: 'ms',
  },
  nonActionableToastDuration: {
    initial: 8000,
    suffix: 'ms',
  },
};

// Utility function to create settings configurations
const createConfig = () => ({
  ...projectSettings,
  ...mapSettings(trailerSettings, false),
  ...mapSettings(designSettings, false),
  ...mapSettings(motionSettings, false),
});

// Settings stores
const createStore = (config) =>
  createSettingsStore({ settingsConfiguration: config, syncToUrl: true });

export const settingStores = createStore(createConfig());

export const IMG_PATH = import.meta.env.BASE_URL + 'images/flows';
export const VIDEO_PATH = import.meta.env.BASE_URL + 'videos';

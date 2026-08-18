import * as migration_20260807_034304 from './20260807_034304';
import * as migration_20260807_172630 from './20260807_172630';
import * as migration_20260808_033851 from './20260808_033851';
import * as migration_20260817_081807 from './20260817_081807';
import * as migration_20260817_082017 from './20260817_082017';

export const migrations = [
  {
    up: migration_20260807_034304.up,
    down: migration_20260807_034304.down,
    name: '20260807_034304',
  },
  {
    up: migration_20260807_172630.up,
    down: migration_20260807_172630.down,
    name: '20260807_172630',
  },
  {
    up: migration_20260808_033851.up,
    down: migration_20260808_033851.down,
    name: '20260808_033851',
  },
  {
    up: migration_20260817_081807.up,
    down: migration_20260817_081807.down,
    name: '20260817_081807',
  },
  {
    up: migration_20260817_082017.up,
    down: migration_20260817_082017.down,
    name: '20260817_082017'
  },
];

export const SAMPLE_DEVICES = [
  { id: 'RB-A', tipus: 'Portàtil', estat: 'En prova' },
  { id: 'RB-B', tipus: 'Portàtil', estat: 'Apte' },
  { id: 'RB-C', tipus: 'Portàtil', estat: 'Diagnosi' },
];

export const DEVICE_TYPES = [
  'Portàtil',
  'Ordinador de sobretaula',
  'Tauleta',
  'Servidor',
];

export const STATUS_OPTIONS = ['En prova', 'Apte', 'Diagnosi'];

export const STORAGE_KEY = 'reboot_study_inventory_devices';

export const STATUS_CONFIG = {
  'En prova': {
    label: 'En prova',
    className: 'badge-en-prova',
    ariaLabel: 'Estat: En prova',
  },
  'Apte': {
    label: 'Apte',
    className: 'badge-apte',
    ariaLabel: 'Estat: Apte',
  },
  'Diagnosi': {
    label: 'Diagnosi',
    className: 'badge-diagnosi',
    ariaLabel: 'Estat: Diagnosi',
  },
};

export function generateNextId(devices) {
  let maxNum = 0;
  for (const device of devices) {
    const match = device.id.match(/^RB-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `RB-${String(nextNum).padStart(3, '0')}`;
}

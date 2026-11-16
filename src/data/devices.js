export const SAMPLE_DEVICES = [
  { id: 'RB-A', tipus: 'Portàtil', estat: 'En prova' },
  { id: 'RB-B', tipus: 'Portàtil', estat: 'Apte' },
  { id: 'RB-C', tipus: 'Portàtil', estat: 'Diagnosi' },
];

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

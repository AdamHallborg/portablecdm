export const noSummary = [
    'seume',
    'prod.portcdm',
]

const hasWithdraw = [
    'dev.portcdm.eu',
];

export const hasEvents = [
    'qa.segot',
    'qa.portcdm.eu',
    'seume.portcdm',
    'qa.nosvg',
    'dev.portcdm.eu',
    'segot.portcdm.eu',
    'qa.esvlc.portcdm.eu',
    '192.168.56.101',
    'qa.sebro.portcdm.eu',
    'esbcn.portcdm.eu',
]

export const isStaging = [
    'dev.portcdm.eu',
]

export const hasComment = [
    'dev.portcdm.eu',
]

export const contentTypeBug = hasEvents;

export const isWithdrawSupported = currentHost => hasWithdraw.some(instance => currentHost.includes(instance));
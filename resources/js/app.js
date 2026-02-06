import './bootstrap';

import { initSimulator } from './sim/simulator';
import { initThreeView } from './three/sim3d';
import { initNeuralStatus } from './neural/status';

const root = document.body;
const pageType = root?.dataset?.page;
const isSim = pageType === 'bio-sim';
const isCompare = pageType === 'bio-compare';
const isThree = pageType === 'bio-3d';
const isNeural = pageType === 'bio-neural';

if (isThree) {
    initThreeView();
} else if (isSim || isCompare) {
    initSimulator({ root, isSim, isCompare });
} else if (isNeural) {
    initNeuralStatus({ root });
}

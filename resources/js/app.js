import './bootstrap';

import { initSimulator } from './sim/simulator';
import { initThreeView } from './three/sim3d';

const root = document.body;
const pageType = root?.dataset?.page;
const isSim = pageType === 'bio-sim';
const isCompare = pageType === 'bio-compare';
const isThree = pageType === 'bio-3d';

if (isThree) {
    initThreeView();
} else if (isSim || isCompare) {
    initSimulator({ root, isSim, isCompare });
}

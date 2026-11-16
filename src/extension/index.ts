import type { NodeCGServerAPI } from '../types/index.js';
import { suppressLivesplitHandlers } from './util/livesplit-handlers.js';
import { set } from './util/nodecg.js';

export default async (nodecg: NodeCGServerAPI) => {
    suppressLivesplitHandlers(); // must run before any await so it's in place before speedcontrol loads
    /**
     * Because of how top-level `import`s work, it helps to use `import`s here
     * to force things to be loaded *after* the NodeCG context is set.
     */
    set(nodecg); // set nodecg "context" before anything else
    await import('./util/replicants.js'); // make sure replicants are set up
    await import('./example.js');
    await import('./countdown-timer.js');
    await import('./quiz.js');
};

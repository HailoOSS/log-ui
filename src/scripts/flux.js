import flux from 'flux-core';
import portalBundle from 'portal-web-bundle';

import constants from './constants';

export default flux.setup({
        constants: constants
}, [portalBundle]);

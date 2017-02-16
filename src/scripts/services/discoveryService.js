import {H2Service} from 'web-core';

class DiscoveryService extends H2Service {
    constructor() {
        super('com.hailocab.kernel.discovery');
    }

    services(request) {
        return this.call('services', request);
    }
}

export default new DiscoveryService();

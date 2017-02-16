import {H2Service} from 'web-core';

class LogService extends H2Service {
    constructor() {
        super('com.hailocab.service.log');
    }

    search(request) {
        return this.call('search', request);
    }

    filters(request) {
        return this.call('filters', request);
    }
}

export default new LogService();

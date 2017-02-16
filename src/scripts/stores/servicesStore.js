import _ from 'lodash';
import {fromJS} from 'immutable';
import {Store} from 'web-core';
import {constants, dispatcher} from '../flux';

import servicesUtil from '../utils/servicesUtil';

const defaultServices = [
    {name: 'hailo-2-api'},
    {name: 'hailo-provisioning-service'},
    {name: 'hailo-provisioning-manager-service'},
    {name: 'osrm.debug'},
    {name: 'phosphor'},
];

export default class ServicesStore extends Store {
    constructor() {
       super({
            services: {},
        });
    }

    getServices() {
        return this.data.get('services');
    }

    setServices(services) {
        // Sort services by name before inserting into store
        services = _.sortBy(services, 'name');

        // Add "build-in" services
        services = defaultServices.concat(services);

        // Extract name from services
        services = _.map(services, service => service.name);

        // Ensure that there are no duplicates
        services = _.uniq(services);

        this.data = this.data.set('services', fromJS(services));
    }
}

let store = new ServicesStore();

store.dispatchToken = dispatcher.register(payload => {
    let data = store.data;

    switch (payload.action) {
        case constants.ActionTypes.SERVICES_LOAD:
            servicesUtil.readServices();
            break;

        case constants.ActionTypes.SERVICES_LOAD_SUCCESS:
            store.setServices(payload.services);
            break;
    }

    if (store.data !== data) store.emitChange();
});

export default store;

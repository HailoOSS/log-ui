const env = 'stg';
const apiURL = null;
window.HailoConfig = {
    environment: {
        h2APIBaseURL: apiURL || 'https://api2-eu-west-1-'+ env + '.elasticride.com',
        environment: env
    },
    config: {}
};

var gulp = require('gulp');
var reactConfigFactory = require('gulp-common/tasks/react-config');

// Those deps will be cached and not watched.
var dependencies = [
    'auth-web-bundle',
    'debug',
    'flux-core',
    'hob-web-bundle',
    'immutable',
    'react',
    'react/addons',
    'react-router',
    'router-web-bundle',
    'web-core',
    'web-toolkit' // Hailo toolkit v5
];

// Extending the default config factory
var configFactory = Object.create(reactConfigFactory);

// add deps
configFactory.getBrowserifyConfig = function(overrides) {
    var config = reactConfigFactory.getBrowserifyConfig.call(this, overrides);
    config.external = dependencies;
    return config;
};

configFactory.getCopyConfig = function(overrides) {
    var config = reactConfigFactory.getCopyConfig.call(this, overrides);
    var pathsToAdd = ['./src/assets/**', './src/fonts/**'];
    config.src = config.src ? pathsToAdd.concat(config.src) : pathsToAdd;
    return config;
};

require('gulp-common/tasks/simple-project-tasks')(gulp, configFactory);

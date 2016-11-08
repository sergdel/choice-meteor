
Package.describe({
    name: 'cesarve:autoform-daterangepicker',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Rage date picker for meteor autoform',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/cesarve77/autoform-daterangepicker',
        // By default, Meteor will default to using README.md for documentation.
        // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});



Package.onUse(function (api) {
    api.versionsFrom('1.4.1.1');
    api.use(['momentjs:moment','templating', 'aldeed:autoform', 'ecmascript']);
    api.mainModule('daterangepicker.js', 'client');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('cesarve:autoform-daterangepicker');
    api.mainModule('daterangepicker-tests.js');
});


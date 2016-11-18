Package.describe({
    name: 'email',
    summary: "Send email messagesxxx",
    version: "1.1.18"
});


Package.onUse(function (api) {
    api.versionsFrom('1.4.2.1');
    api.use(['ecmascript','mongo']);
    api.mainModule('email.js');
    api.export('Email')

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('email');
    api.mainModule('email-tests.js');
});

Npm.depends({
    "mailgun-js": "0.7.13"
})




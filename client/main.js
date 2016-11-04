import {familyStatus} from "/imports/api/family/family-status";
import "./bootstrap.css"
import "/node_modules/bootstrap/dist/js/bootstrap"

import "/imports/startup/client/"

import moment from 'moment'
Template.registerHelper('showDate', function (val) {
    const limit = moment(val);
    if (limit.isValid())
        return limit.format('Do MMM YY');
    else
        return ''
});
Template.registerHelper('showTime', function (val) {
    const limit = moment(val);
    if (limit.isValid())
        return limit.format('Do MMM YY - HH:mm:ss');
    else
        return ''

});
Template.registerHelper('showFrom', function (val) {
    const limit = moment(val);
    if (limit.isValid())
        return limit.fromNow();
    else
        return ''
});

Template.registerHelper('familyStatus', function (val) {
    return familyStatus[val].label
});

Template.registerHelper('capitalize', function (val) {
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
});



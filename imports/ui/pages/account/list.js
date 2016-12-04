import {Accounts} from '/imports/api/account/account'
import {Template} from 'meteor/templating'
import './list.html'

Template.accountList.helpers({
    autoTable: Accounts.autoTable
});

Template.accountList.events({
    //add your events here
});

Template.accountList.onCreated(function () {
    //add your statement here
});

Template.accountList.onRendered(function () {
    //add your statement here
});

Template.accountList.onDestroyed(function () {
    //add your statement here
});


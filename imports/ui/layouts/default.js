import "./default.html";
import "./default.css";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

Template.layout.helpers({
    subsReady: ()=> {
        return Session.get('Roles.subscription.ready')
    }
});
Template.layout.onCreated(function () {


});
Template.layout.events({
    'click .logout'() {
        AccountsTemplates.logout()
    },
    'click .goto'(e){
        FlowRouter.go($(e.currentTarget).data('link'))
    }
});

Template.layout.onRendered(function () {
    $('body').tooltip({
        selector: '[title]:not(.raty)',
        delay: 200
    });
});
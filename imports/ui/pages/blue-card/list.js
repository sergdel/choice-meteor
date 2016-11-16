import "./list.html"
import "./search-form"
//import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
//import {rowsByPage} from "/imports/api/globals";
import {BlueCard} from "/imports/api/blue-card/blue-card";
//import {moment} from 'meteor/momentjs:moment'

Template.blueCardList.onCreated(function () {

});
Template.blueCardList.onRendered(function () {

});

Template.blueCardList.onDestroyed(function () {
    //add your statement here
});


Template.blueCardList.helpers({
    autoTable: BlueCard.autoTable
});

Template.blueCardList.events({

});


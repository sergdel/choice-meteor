import "./list.html"
import {Template} from "meteor/templating"
import {familiesAutoTableAdmin,familiesAutoTableStaff} from "/imports/api/family/auto-table";

Template.familyList.onCreated(function () {

});
Template.familyList.onRendered(function () {


});

Template.familyList.onDestroyed(function () {
    //add your statement here
});


Template.familyList.helpers({
   autoTable:()=>{
       if (Roles.userIsInRole(Meteor.userId(),'admin')){
           return familiesAutoTableAdmin
       }else{
           return familiesAutoTableStaff
       }
   }
});

Template.familyList.events({


});


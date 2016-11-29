import "./list.html"
import {Template} from "meteor/templating"
import {familiesAutoTableAdmin,familiesAutoTableStaff} from "/imports/api/family/auto-table";
import {emailSchema} from "/imports/api/family/family"
import "/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo"
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

    'click .groupFamily'(e, instance){

        BootstrapModalPrompt.prompt({
            title: "New Family",
            autoform: {
                schema: emailSchema,
                type: "method",
                meteormethod: "familyNew",
                id: 'familyNew',
                buttonContent: false,
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                FlowRouter.go('familyEdit', {familyId: data})
            }
            else {
                console.log('cancel')
            }
        });
    },
});


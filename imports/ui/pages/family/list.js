import "./list.html"
import "./search-form.js"
import {Template} from "meteor/templating"
import {familiesAutoTableAdmin, familiesAutoTableStaff} from "/imports/api/family/auto-table";
import {emailSchema} from "/imports/api/family/family"
import "/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo"

Template.familyList.onCreated(function () {

});
Template.familyList.onRendered(function () {
    this.subscribe('tags')

});

Template.familyList.onDestroyed(function () {
    //add your statement here
});


Template.familyList.helpers({
    autoTable: () => {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return familiesAutoTableAdmin
        } else {
            return familiesAutoTableStaff
        }
    },
    customQuery: function () {
        return () => {
            let customQuery = {}
            const address = Session.get('searchFamilyListForm.address')
            if (address) {
                customQuery = {
                    "contact.address.geometry": {
                        $near: {
                            $geometry: address.geometry,
                            $maxDistance: Session.get('searchFamilyListForm.distance')
                        }
                    }
                }

            }
            const queryContact = Session.get('searchFamilyListForm.queryContact')
            if (queryContact) {
                customQuery.$or = [
                    {"emails.address": {$regex: queryContact, $options: 'gi'}},
                    {"parents.email": {$regex: queryContact, $options: 'gi'}},
                    {"parents.mobilePhone": {$regex: queryContact, $options: 'gi'}},
                    {"emails.homePhone": {$regex: queryContact, $options: 'gi'}},
                ]
            }
            console.log('customQuery', customQuery)
            return customQuery
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


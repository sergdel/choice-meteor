import "/imports/api/family/family";
import "/imports/ui/componets/accordion";
import "/imports/ui/componets/button-submit"

import "./form.html";

import {Template} from "meteor/templating";
import {familySchema} from "/imports/api/family/family";
import "/imports/api/files/files";

Template.familyForm.helpers({
    schema: familySchema,
    new: () => Template.instance().data.formType == "method",
    edit: () => Template.instance().data.formType == "method-update",
    familyStatusOptions: () => Template.instance().data.familyStatusOptions,
    omitFields: () => {

        if (Roles.userIsInRole(Meteor.userId(), ['staff', 'admin'])) {
            return []
        } else {
            return ['parents.$.blueCard.status', 'parents.$.blueCard.registered','children.$.blueCard.status', 'children.$.blueCard.registered','guests.$.blueCard.status', 'guests.$.blueCard.registered']
        }
    }

});

Template.familyForm.events({
    //add your events here
});

Template.familyForm.onCreated(function () {
    this.autorun(()=>{
        if (Roles.userIsInRole(Meteor.userId(),['admin','staff'])){
            this.subscribe('tags')
        }
    })
});

Template.familyForm.onRendered(function () {
    //add your statement here
});

Template.familyForm.onDestroyed(function () {
    //add your statement here
});


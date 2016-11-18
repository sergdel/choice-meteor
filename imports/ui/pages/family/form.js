import "/imports/api/family/family";
import "/imports/ui/componets/accordion";
import "/imports/ui/componets/button-submit"

import "./form.html";

import {Template} from "meteor/templating";
import {familySchema} from "/imports/api/family/family";
import {familyStatus} from "/imports/api/family/family-status";
import {emailTemplateSchema} from "/imports/api/family/email-template";
import "/imports/api/files/files";

Template.familyForm.helpers({
    schema: familySchema,
    new: ()=>Template.instance().data.formType == "method",
    edit: ()=>Template.instance().data.formType == "method-update",
    familyStatusOptions: ()=>Template.instance().data.familyStatusOptions

});

Template.familyForm.events({
    //add your events here
});

Template.familyForm.onCreated(function () {
    //todo que solo se suscriba a lo que se esta viendo

});

Template.familyForm.onRendered(function () {
    //add your statement here
});

Template.familyForm.onDestroyed(function () {
    //add your statement here
});


import "/imports/api/group/group";
import "/imports/ui/componets/accordion";
import "./form.html";
import {Template} from "meteor/templating";
import {groupSchema} from "/imports/api/group/group";
import {groupStatus} from "/imports/api/group/group-status";
import {emailTemplateSchema} from "/imports/api/group/email-template";
import "/imports/api/files/files";

Template.groupForm.helpers({
    schema: groupSchema,
    new: ()=>Template.instance().data.formType == "method",
    edit: ()=>Template.instance().data.formType == "method-update",
    groupStatusOptions: ()=>Template.instance().data.groupStatusOptions

});

Template.groupForm.events({
    //add your events here
});

Template.groupForm.onCreated(function () {
    //todo que solo se suscriba a lo que se esta viendo
    this.subscribe('files');
});

Template.groupForm.onRendered(function () {
    //add your statement here
});

Template.groupForm.onDestroyed(function () {
    //add your statement here
});


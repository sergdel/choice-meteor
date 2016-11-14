import "/imports/api/staff/staff"
import './form.html'
import {Template} from 'meteor/templating'
import {staffSchema} from "/imports/api/staff/staff";
import {beginSubmit} from "/imports/api/utilities"
import {endSubmit} from "/imports/api/utilities"
Template.staffForm.helpers({
    schema: staffSchema,
    new: ()=>Template.instance().data.formType == "method",
    edit: ()=>Template.instance().data.formType == "method-update",
    typePhoneName(){
        return this.name + '.typePhone'
    },
    phoneName(){
        return this.name + '.phone'
    },
    isMe:()=>FlowRouter.getParam("staffId")==Meteor.userId()


});
AutoForm.hooks({
    staffForm: {
        beginSubmit: function (a, b) {
            beginSubmit.call(this)
        },
        onSubmit: function () {

        },
        onError: function (formType, error) {
            endSubmit.call(this)
        },
        endSubmit: function () {
            endSubmit.call(this)
        },
        formToDoc: function (doc) {
            doc.roles = [doc.roles];
            return doc
        },

        // Called every time an update or typeless form
        // is revalidated, which can be often if keyup
        // validation is used.
        formToModifier: function (modifier) {
            // alter modifier
            modifier.$set.roles = [modifier.$set.roles];
            return modifier
        },

        // Called whenever `doc` attribute reactively changes, before values
        // are set in the form fields.
        docToForm: function (doc, ss) {
            doc.roles = doc.roles[0];
            return doc
        },
    }
});
Template.staffForm.events({
    //add your events here
});

Template.staffForm.onCreated(function () {
    //add your statement here
});

Template.staffForm.onRendered(function () {
    //add your statement here
});

Template.staffForm.onDestroyed(function () {
    //add your statement here
});


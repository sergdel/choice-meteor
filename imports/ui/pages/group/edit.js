import "./edit.html"
import {Template} from "meteor/templating";
import {Groups} from "/imports/api/group/group";
import '/imports/ui/componets/autoform/readonly/readonly'
Template.groupEdit.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('group', FlowRouter.getParam("groupId"))
    })
});

Template.groupEdit.onRendered(function () {

});

Template.groupEdit.onDestroyed(function () {
    //add your statement here
});

Template.groupEdit.helpers({
    collection: ()=> {
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        Groups.attachSchema(Groups.schemas.edit)
        return Groups
    },
    group: ()=> {
        return Groups.findOne(FlowRouter.getParam("groupId"))
    },
    found: ()=> {
        return !!Groups.findOne(FlowRouter.getParam("groupId"))
    },


})
;

Template.groupEdit.events({});



import './group.html'
import './update-status'
import {Template} from 'meteor/templating'
import {Groups} from "/imports/api/group/group";

Template.group.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('group', FlowRouter.getParam("groupId"))
    })
});

Template.group.onRendered(function () {
    //add your statement here
});

Template.group.onDestroyed(function () {
    //add your statement here
});

Template.group.helpers({
    data:()=>{
        return {
            groupId: FlowRouter.getParam("groupId"),
            group: Groups.findOne(FlowRouter.getParam("groupId")),
            found: !!Groups.findOne(FlowRouter.getParam("groupId"))
        }
    }

});

Template.group.events({
    //add your events here
});

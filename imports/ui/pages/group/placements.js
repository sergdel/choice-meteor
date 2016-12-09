import './placements.html'
Template.groupPlacements.onCreated(function () {
    //add your statement here
});

Template.groupPlacements.onRendered(function () {
    //add your statement here
});

Template.groupPlacements.onDestroyed(function () {
    //add your statement here
});

Template.groupPlacements.helpers({
    groupId:()=>FlowRouter.getParam("groupId"),
});

Template.groupPlacements.events({
    //add your events here
});

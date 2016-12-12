import './placements.html'
import {familiesPlacementAppliedAutoTable,familiesPlacementConfirmedAutoTable,familiesPlacementPotentialAutoTable} from '/imports/api/group/placement/families'
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
    familiesPlacementAppliedAutoTable: ()=>familiesPlacementAppliedAutoTable,
    familiesPlacementConfirmedAutoTable: ()=>familiesPlacementConfirmedAutoTable,
    familiesPlacementPotentialAutoTable: ()=>familiesPlacementPotentialAutoTable,
    applied:()=>{
        return {"groups.applied.groupId": FlowRouter.getParam('groupId')}
    },
    confirmed:()=>{
        return {"groups.confirmed.groupId": FlowRouter.getParam('groupId')}
    },
    potential:()=>{
        const groupId=FlowRouter.getParam('groupId')
        return {"groups.applied.groupId": {$ne: groupId},"groups.confirmed.groupId": {$ne: groupId}}
    },
});

Template.groupPlacements.events({
    //add your events here
});

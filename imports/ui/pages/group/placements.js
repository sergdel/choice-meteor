import './placements.html'
import './update-status'
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
        return {"groups" : {$elemMatch: {groupId: FlowRouter.getParam('groupId'), status: 'applied' }}}
    },
    confirmed:()=>{
        return {"groups" : {$elemMatch: {groupId: FlowRouter.getParam('groupId'), status: 'confirmed' }}}

    },
    potential:()=>{
        const groupId=FlowRouter.getParam('groupId')
        return {"groups.groupId": {$ne: groupId}}
    },
});

Template.groupPlacements.events({
    //add your events here
});

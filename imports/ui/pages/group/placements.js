import './placements.html'
import './update-status'
import './conflict.html'
import '../family/contact'
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
    potential:function(){
        const groupId=FlowRouter.getParam('groupId')
        const dates= this.group &&  this.group.dates
        const and=[]
        and.push ({$or:[{"groups.groupId": {$ne: groupId}},{"groups" : {$elemMatch: {groupId: groupId, status: 'canceled' }}}]})
        if (dates && dates[0] && dates[1] && (dates[0] instanceof Date) && (dates[1] instanceof Date) ) {
            and.push({
                $or: [
                    {availability: {$exists: 0}},
                    {
                        //dates0 and dates1 can not be between a confirmed group
                        "availability.dates.0": {$not: {$gte: dates[0], $lte: dates[1]}},
                        "availability.dates.1": {$not: {$gte: dates[0], $lte: dates[1]}},
                        //dates and wrapped a dates of confirmed group
                        $or: [
                            {"availability.dates.0": {$gte: dates[1]}},
                            {"availability.dates.1": {$lte: dates[0]}}
                        ]
                    }
                ]

            })
        }
        return {$and: and}
    },
});

Template.groupPlacements.events({
});

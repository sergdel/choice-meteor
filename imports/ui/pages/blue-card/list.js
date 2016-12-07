import "./list.html"
import "./notes"
import {Template} from "meteor/templating"
import {BlueCard} from "/imports/api/blue-card/blue-card";
import "/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo"
Template.blueCardList.onCreated(function () {

});
Template.blueCardList.onRendered(function () {

});

Template.blueCardList.onDestroyed(function () {
    //add your statement here
});


Template.blueCardList.helpers({
    autoTable: BlueCard.autoTable,
    settings: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff'])) {
            return {}
        } else {
            return {
                options: {
                    filters: false,
                }
            }
        }
    },
    customQuery: function () {
        let familyId = FlowRouter.getParam('familyId')
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff'])) {
            if (familyId){
                return {familyId}
            }else{
                return {}
            }
        }
    }
})
;

Template.blueCardList.events({});


import "./list.html"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {Groups} from "/imports/api/group/group"
import {moment} from 'meteor/momentjs:moment'
import {Families} from '/imports/api/family/family'

Template.groupList.onCreated(function () {

});
Template.groupList.onRendered(function () {

});

Template.groupList.onDestroyed(function () {
    //add your statement here
});


Template.groupList.helpers({
    autoTableStaff: Groups.autoTableStaff,
    autoTableFamilyAvailable: Groups.autoTableFamilyAvailable,
    autoTableFamilyApplied: Groups.autoTableFamilyApplied,
    autoTableFamilyConfirmed: Groups.autoTableFamilyConfirmed,
    customQueryAvailable: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            return {"families.familyId": {$ne: FlowRouter.getParam('familyId')}}
        else
            return {"families.familyId": {$ne: Meteor.userId()}}
    },
    customQueryApplied: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            return {"families": {$elemMatch: {status:  "applied", familyId: FlowRouter.getParam('familyId')}}}
        else
            return {"families": {$elemMatch: {status:  "applied", familyId: Meteor.userId()}}}
    },
    customQueryConfirmed: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            return {"families": {$elemMatch: {status:  "confirmed", familyId: FlowRouter.getParam('familyId')}}}
        else
            return {"families": {$elemMatch: {status:  "confirmed", familyId: Meteor.userId()}}}
    },
});
Template.bsModalPrompt.events({
    'click .groupCancelApply'(e, instance){
        Meteor.call('groupCancelApply', $(e.currentTarget).data('group-id'), $(e.currentTarget).data('family-id'), function (err, res) {
            BootstrapModalPrompt.hide()
        })
    },
})
Template.groupList.events({

    'click .applyGroup'(e, instance){
        let familyId
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            familyId = FlowRouter.getParam('familyId')
        else
            familyId = Meteor.userId()
        let groupApply = _.findWhere(this.families, {familyId: familyId})
        const cancelButton = groupApply ? '<button class="btn btn-danger btn-xs groupCancelApply" data-group-id="' + this._id + '" data-family-id="' + familyId + '">Cancel application <i class="fa fa-trash"></i></button>' : ''

        if (!groupApply) {
            //if there is'nt a group apply is because in creating a new one in this case in take te values from the last application
            const family=Families.findOne(familyId)
            groupApply=family && family.groups &&  _.where(family.groups,{status: 'applied'} ).pop()
        }
        const moment1 = this.dates && this.dates[0] && moment(this.dates[0])
        const moment2 = this.dates && this.dates[1] && moment(this.dates[1])
        const dates = moment1 && moment2 && moment1.isValid() && moment2.isValid() ? `(${moment1.format('Do MMM YY')} to ${moment2.format('Do MMM YY')})` : ""
        const location = this.location ? `(Location: ${this.location})` : ""
        const title = `Welcome guests from ${this.name} group ${dates} ${location}`
        const content = (this.requirements || ' ') + (this.requirements && this.other ? ' <br>' : '') + (this.other || ' ')
        BootstrapModalPrompt.prompt({
            attachTo: instance.firstNode,
            title,
            content: content,
            content1: cancelButton,
            autoform: {
                schema: Groups.schemas.apply,
                type: "normal",
                doc: groupApply,
                id: 'applyGroup',
                buttonContent: false,
                omitFields: ['familyId','status']
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, (data) => {
            const familyId = FlowRouter.getParam('familyId')
            if (data) {
                Meteor.call('groupApply', this._id, familyId, data, function (err, res) {
                    if (err)
                        console.error('groupApply', err)
                })
            }
            else {
            }
        });


    },
    'click .groupNew'(e, instance){
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        BootstrapModalPrompt.prompt({
            title: "New Group",
            autoform: {
                collection: Groups,
                schema: Groups.schemas.new,
                type: "method",
                "meteormethod": "groupNew",
                id: 'groupNew',
                buttonContent: false,
                omitFields: ['requirements']

            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                FlowRouter.go('groupEdit', {groupId: data})
            }
            else {
            }
        });
    },

});


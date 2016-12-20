import "./list.html"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {Groups} from "/imports/api/group/group"
import {moment} from 'meteor/momentjs:moment'
import {Families} from '/imports/api/family/family'

Template.groupList.onCreated(function () {
    this.customQuery = new ReactiveVar( {} );
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
    autoTableFamilyConfirmedReady:()=>{
        return Groups.autoTableFamilyConfirmed.subscriptionReady()
    },
    customQueryAvailable: function () {
        return ()=> {
            const family = Families.findOne(this.familyId, {groups: 1})
            const unavailability=family.availability || []
            const confirmedGroupIds = (family && family.groups && _.pluck(_.where(family.groups, {status: 'confirmed'}), 'groupId')) || []
            const and = []
            if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
                and.push({"families.familyId": {$ne: FlowRouter.getParam('familyId')}})
            else
                and.push({"families.familyId": {$ne: Meteor.userId()}})

            const confirmedGroups = Groups.find({_id: {$in: confirmedGroupIds}}, {fields: {dates: 1}})
            console.log('confirmedGroups', confirmedGroups.fetch())
            confirmedGroups.forEach((confirmed) => {
                console.log('confirmed', confirmed)
                if (confirmed.dates && confirmed.dates[0] && confirmed.dates[1] && confirmed.dates[0] instanceof Date && confirmed.dates[1] instanceof Date ) {
                    and.push({
                        //dates0 and dates1 can not be between a confirmed group
                        "dates.0": {$not: {$gte: confirmed.dates[0], $lte: confirmed.dates[1]}},
                        "dates.1": {$not: {$gte: confirmed.dates[0], $lte: confirmed.dates[1]}},
                        //dates and wrapped a dates of confirmed group
                        $or: [
                            {"dates.0": {$gte: confirmed.dates[1]}},
                            {"dates.1": {$lte: confirmed.dates[0]}}
                        ]
                    })
                }
            })
            unavailability.forEach((dates)=>{
                dates= dates && dates.dates
                console.log('unavailability', dates , dates[0] , dates[1] , (dates[0] instanceof Date) , (dates[1] instanceof Date) )
                if (dates && dates[0] && dates[1] && (dates[0] instanceof Date) && (dates[1] instanceof Date) ){
                    and.push({
                        //dates0 and dates1 can not be between a confirmed group
                        "dates.0": {$not: {$gte: dates[0], $lte: dates[1]}},
                        "dates.1": {$not: {$gte: dates[0], $lte: dates[1]}},
                        //dates and wrapped a dates of confirmed group
                        $or: [
                            {"dates.0": {$gte: dates[1]}},
                            {"dates.1": {$lte: dates[0]}}
                        ]
                    })
                }
            })
            console.log('before--------->', {$and: and})


            return {$and: and}
        }
    },
    customQueryApplied: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            return {"families": {$elemMatch: {status: "applied", familyId: FlowRouter.getParam('familyId')}}}
        else
            return {"families": {$elemMatch: {status: "applied", familyId: Meteor.userId()}}}
    },
    customQueryConfirmed: function () {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff']))
            return {"families": {$elemMatch: {status: "confirmed", familyId: FlowRouter.getParam('familyId')}}}
        else
            return {"families": {$elemMatch: {status: "confirmed", familyId: Meteor.userId()}}}
    },
    customQuery: function() {
        var query = Template.instance().customQuery.get();
        return query;
    }
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
            const family = Families.findOne(familyId)
            groupApply = family && family.groups && _.where(family.groups, {status: 'applied'}).pop()
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
                omitFields: ['familyId', 'status']
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

    'change input[name="dates.0"]': function (evt, tpl){
        evt.preventDefault();
        var from_date = $('input[name="dates.0"]').val();
        var customQuery = Template.instance().customQuery.get();
        console.log ("clicked date - "+from_date);
        //console.log (new Date(from_date));
        customQuery["dates.0"] = {"$gte": new Date(from_date)};
        Template.instance().customQuery.set(customQuery);
        console.log (customQuery);
        console.log (Template.instance());
        Template.instance().view._render();
    },

    'change input[name="dates.1"]': function (evt, tpl){
        evt.preventDefault();
        var from_date = $('input[name="dates.1"]').val();
        var customQuery = Template.instance().customQuery.get();
        console.log ("clicked date - "+from_date);
        //console.log (new Date(from_date));
        customQuery["dates.1"] = {"$lte": new Date(from_date)};
        Template.instance().customQuery.set(customQuery);
        console.log (customQuery);
    },
});


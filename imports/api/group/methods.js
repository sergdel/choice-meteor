/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Groups} from '/imports/api/group/group'
import {Families} from '/imports/api/family/family'


Meteor.methods({
    groupNew: function (doc) {
        this.unblock()
        check(doc, Groups.schemas.new)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
            throw new Meteor.Error(403, 'Access denied!', 'Only staff can create new groups')
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        return Groups.insert(doc)
    },
    groupEdit: function (modifier, groupId) {
        this.unblock()
        check(groupId, String)
        check(modifier, Object)
        Groups.simpleSchema().newContext("groupEdit").validate(modifier, {modifier: true});
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
            throw new Meteor.Error(403, 'Access denied!', 'Only staff can update new groups')
        this.unblock()
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        Groups.attachSchema(Groups.schemas.edit)
        return Groups.update(groupId, modifier)

    },
    groupCancelApply: function (groupId, familyId) {
        console.log('groupCancelApply', familyId)
        this.unblock()
        if (!Roles.userIsInRole(this.userId, ['family', 'admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access denied!', 'Only logged users can apply to groups')
        }
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            familyId = this.userId
        }
        console.log('groupCancelApply', familyId)
        check(groupId, String)
       return Groups.cancelApply(groupId,familyId)
    },
    groupApply: function (groupId, familyId, data) {
        console.log('groupApply', familyId)
        this.unblock()
        if (!Roles.userIsInRole(this.userId, ['family', 'admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access denied!', 'Only logged users can apply to groups')
        }
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            familyId = this.userId
        }
        console.log('groupApply', familyId)
        data.familyId = familyId
        check(data, Groups.schemas.apply)
        check(groupId, String)

        //todo maybe this code has to be in group class., maybe in a method apply
        return Groups.apply(groupId,familyId,data)

    }
})
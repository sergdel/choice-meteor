/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Groups} from '/imports/api/group/group'


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
    groupApply: function (groupId) {
        this.unblock()
        check(groupId, String)
        if (!Roles.userIsInRole('family')) {
            throw new Meteor.Error(403, 'Access denied!', 'Only families can apply to groups')
        }
        return Groups.update(groupId, {$addToSet: {appliedFamilies: this.userId}}, {filter: false})
    }
})
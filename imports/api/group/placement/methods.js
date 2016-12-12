/**
 * Created by cesar on 9/12/16.
 */
/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Groups} from '/imports/api/group/group'
import {Families} from '/imports/api/family/family'


Meteor.methods({
    groupUpdateStatus: function (groupId,familyId) {
        check(familyId,String)
        check(groupId,String)
        if (!Roles.userIsInRole(this.userId,['admin','staff'])){
            throw new Meteor.Error(403,'Access deny','Only staff and admin can update family - group status')
        }
        Groups.confirmFamily(groupId,familyId)
    }
})
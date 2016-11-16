/**
 * Created by cesar on 28/9/16.
 */
/**
 * Created by cesar on 27/9/16.
 */
import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {Roles} from 'meteor/alanning:roles'
import {staffSchema} from '/imports/api/staff/staff'
import {check} from 'meteor/check'
import {sendEnrollmentEmailTemplateForStaff} from "/imports/api/utilities";
import {sendVerificationEmailTemplateForStaff} from "/imports/api/utilities";
Meteor.methods({
    staffNew: function (doc) {
        if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        //todo pregunta quien peude crear nuevois usuarios
        if (!Roles.userIsInRole(this.userId, ['admin']))
            throw new Meteor.Error(403, 'Access forbidden', 'User have not admin role');
        check(doc, staffSchema);
        if (Accounts.findUserByEmail(doc.email)) {
            throw new Meteor.Error(400, 'Bad request', 'Email already exist')
        }
        const userId = Accounts.createUser({email: doc.email});
        sendEnrollmentEmailTemplateForStaff(userId);
        return Meteor.users.update(userId, {
            $set: {
                email: doc.email,
                firstName: doc.firstName,
                surname: doc.surname,
                phones: doc.phones,
                roles: ['staff'],
                created: {at: new Date, by: this.userId}
            }
        })
    },
    staffRemove: function (staffId) {
        if (!Roles.userIsInRole(this.userId, ['admin']))
            throw new Meteor.Error(403, 'Access forbidden', 'User have not admin role');
        if (staffId == this.userId)
            throw new Meteor.Error(404, 'Access forbidden', 'You can not remove your self');
        Meteor.users.remove(staffId)
    },
    staffEdit: function (modifier, staffId) {
        if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        //check if is authorized
        if (!Roles.userIsInRole(this.userId, ['admin']))
            throw new Meteor.Error(403, 'Access forbidden', 'User have not admin role');
        if (staffId == this.userId && modifier.$set && Array.isArray(modifier.$set.roles) && modifier.$set.roles[0] != 'admin') {
            throw new Meteor.Error(403, 'Access forbidden', 'You can\'t unactivated yourself')
        }
        //check if is a validate schema
        if (Meteor.isServer) {
            staffSchema.newContext("staffForm").validate(modifier, {modifier: true});
            //clean the modifier to be as schema
            staffSchema.clean(modifier, {isModifier: true});
            //if the modifier are setting parents checks the email
            if (modifier.$set && modifier.$set.email) {
                const staff = Accounts.findUserByEmail(modifier.$set.email);
                if (staff && staff._id != staffId) {
                    throw new Meteor.Error(400, 'Bad request', 'Email already exist')
                }
                if (!staff) {
                    sendVerificationEmailTemplateForStaff();
                    Accounts.sendVerificationEmail(staffId);
                    Accounts.addEmail(staffId, modifier.$set.email)
                }
            }
        }
        return Meteor.users.update(staffId, modifier)
    },

});
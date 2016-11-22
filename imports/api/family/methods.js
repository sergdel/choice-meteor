/**
 * Created by cesar on 27/9/16.
 */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {Roles} from "meteor/alanning:roles";
import {familySchema} from "/imports/api/family/family";
import {Families} from "/imports/api/family/family";
import {
    sendEnrollmentEmailTemplateForFamily,
    sendVerificationEmailTemplateForFamily,
    sendUpdateFamilyStatusEmail
} from "/imports/api/utilities";
import {Random} from 'meteor/random'
import {_} from 'lodash'


Meteor.methods({

    createToken: function (familyId) {
        if (!Roles.userIsInRole(this.userId, ['admin'])) {
            Meteor.Error(403, 'Access forbidden', 'Only admin can create tokens')
        }
        LoginToken.setExpiration(60 * 1000)
        return LoginToken.createTokenForUser(familyId);

    },
    familyEdit: function (modifier, familyId) {
        //if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        //check if is authorized
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            if (familyId == this.userId) {
                modifier = _.omit(['$set.office', '$unset.office', '$set.adult.status', '$set.adult.score', '$unset.adult.status', '$unset.adult.score'])
            } else {
                throw new Meteor.Error(403, 'Access forbidden', 'Users can only edit their own profile')
            }
        }
        //check if is a validate schema
        if (Meteor.isServer) {
            familySchema.newContext("familyEdit").validate(modifier, {modifier: true});
            //clean the modifier to be as schema
            familySchema.clean(modifier, {isModifier: true});
            //if the modifier are setting parents checks the email
            if (modifier.$set && modifier.$set.parents) {
                modifier.$set.parents.forEach(function (parent) {
                    if (parent.email) {
                        //if are not my email throw error
                        const family = Accounts.findUserByEmail(parent.email);
                        if (family && family._id != familyId) {
                            throw new Meteor.Error(400, 'Bad request', 'Email already exist')
                        }
                        //if there's not family is becaouse is anew email and i have to send the verification email
                        if (!family) {
                            sendVerificationEmailTemplateForFamily(familyId, parent.email)
                        }
                    }
                })
            }
            if (modifier.$set && modifier.$set.office && modifier.$set.office.familyStatusEmailTemplate) {
                sendUpdateFamilyStatusEmail(familyId, modifier.$set.office.familyStatusEmailTemplate);
                delete modifier.$set.office.familyStatusEmailTemplate
            }
        }
        console.log(modifier)
        Families.update(familyId, modifier, {userId: this.userId})


    },
    emailExist: function (email, isNotThisFamilyId) {
        //if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        let query = {$or: [{emails: {$elemMatch: {address: email}}}, {parents: {$elemMatch: {email}}}]};
        if (isNotThisFamilyId)
            query._id = {$ne: isNotThisFamilyId};
        return Meteor.users.find(query).count() > 0
    },


});

/**
 familyNew: function (doc) {
        if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment)
        //todo pregunta quien peude crear nuevois usuarios
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
            throw new Meteor.Error(403, 'Access forbidden', 'User have not staff or admin role')
        check(doc, familySchema)
        familySchema.clean(doc);
        let emailExist = false
        doc.parents.forEach(function (parent) {
            if (Accounts.findUserByEmail(parent.email)) {
                throw new Meteor.Error(400, 'Bad request', 'Email already exist')
            }
        })
        const userId = Accounts.createUser({email: doc.parents[0].email})
        doc.parents.forEach(function (parent, i) {
            if (i > 0) {
                Accounts.addEmail(userId, parent.email)
            }
        })
        sendEnrollmentEmailTemplateForFamily(userId)

        return Meteor.users.update(userId, {
            $set: {
                parents: doc.parents,
                contact: doc.contact,
                children: doc.children,
                guests: doc.guests,
                pets: doc.pets,
                bedrooms: doc.bedrooms,
                bank: doc.bank,
                other: doc.other,
                office: doc.office,
                adult: doc.adult,
                roles: ['family'],
                files: doc.files,
                created: {at: new Date, by: this.userId}
            }
        })
    },
 **/
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
import {check} from 'meteor/check'


Meteor.methods({
    updateFamilyFirstVisitStaff:function(familyId,staffId){
        check (familyId,String)
        check (staffId,String)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update visits')
        Families.update(familyId,{$set:{'office.firstVisit.staffId':staffId}})
    },
    updateFamilyFirstVisitTime:function(familyId,time){
        console.log(time)
        check (familyId,String)
        check (time,Date)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update visits')
        Families.update(familyId,{$set:{'office.firstVisit.time':time}})
    },
    updateFamilySearchNotes:function(familyId,notes){
        check (familyId,String)
        check (notes,String)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update notes')
        return Families.update(familyId, {$set: {quickNotes: notes}})
    },
    createToken: function (familyId) {
        this.unblock()
        check(familyId, String)
        if (!Roles.userIsInRole(this.userId, ['admin'])) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only admin can create tokens')
        }
        LoginToken.setExpiration(60 * 1000)
        return LoginToken.createTokenForUser(familyId);

    },
    familyReviewed: function (familyId) {
        this.unblock()
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            familyId = this.userId
        }
        return Families.update(familyId, {$set: {reviewed: new Date()}})
    },
    familyRemove: function (familyId) {
        this.unblock()
        check(familyId, String)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only admin can remove profiles')
        }
        Families.remove(familyId, {userId: this.userId})
    },
    familyEdit: function (modifier, familyId) {
        this.unblock()
        check(familyId, String)
        check(modifier, Object)
        //if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        //check if is authorized

        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            if (familyId == this.userId) {
                modifier = _.omit(modifier, ['$set.office', '$unset.office', '$set.adult.status', '$set.adult.score', '$unset.adult.status', '$unset.adult.score'])
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
                    if (parent && parent.email) {
                        //if are not my email throw error
                        const family = Accounts.findUserByEmail(parent.email);
                        if (family && family._id != familyId) {
                            throw new Meteor.Error(400, 'Bad request', 'Email already exist')
                        }
                        //if there's not family is becaouse is anew email and i have to send the verification email
                        if (!family) {
                            Accounts.addEmail(familyId, parent.email)
                            // sendVerificationEmailTemplateForFamily(familyId, parent.email)
                        }
                    }
                })
            }
            if (modifier.$set && modifier.$set.office && modifier.$set.office.familyStatusEmailTemplate) {
                //sendUpdateFamilyStatusEmail(familyId, modifier.$set.office.familyStatusEmailTemplate);
                delete modifier.$set.office.familyStatusEmailTemplate
            }
        }
        console.log('familyEdit',familyId,modifier.$set.parents[0].blueCard)

        Families.update(familyId, modifier, {userId: this.userId})


    },
    emailExist: function (email, isNotThisFamilyId) {
        this.unblock()
        check(email, String)

        //if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        let query = {$or: [{emails: {$elemMatch: {address: email}}}, {parents: {$elemMatch: {email}}}]};
        if (isNotThisFamilyId)
            query._id = {$ne: isNotThisFamilyId};
        return Meteor.users.find(query).count() > 0
    },
    familyNew: function (doc) {
        this.unblock()
        check(doc, Object)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only staff and admin can create new families')

        }
        return Families.insert(doc.email, {userId: this.userId})
    }
})

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
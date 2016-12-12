/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Families} from '/imports/api/family/family'
import {Groups} from '/imports/api/group/group'
import {Meteor} from 'meteor/meteor'
import {Email} from 'meteor/email'
import {Migrations} from 'meteor/percolate:migrations'
import {updateGroupCount} from '/imports/api/family/family'
import {insertBlueCards} from "/imports/api/family/family";
import {emailTemplateFixtures} from "/imports/api/email/server/email-template-fixtures";
import {EmailTemplates} from '/imports/api/email/templates'
Migrations.config({
    log: true
});

Meteor.startup(() => {
    Migrations.migrateTo('latest');
})
Migrations.add({
    version: 1,
    name: 'Update blue card status" ',
    up: function () {//code to migrate up to version 1}
        cursor = Meteor.users.find({
            "roles": "family",
            "groups.applied": {$exists: true}
        })
        const groups = Groups.find({}).fetch()
        cursor.forEach((family) => {
            const familyGroups = []
            const groupsIds = family.groups.applied
            for (let _id of groupsIds) {

                const currentGroup = _.findWhere(groups, {_id})
                if (currentGroup){
                    const familiesApplying = currentGroup.familiesApplying
                    const familyApplied = _.findWhere(familiesApplying, {familyId: family._id})
                    familyApplied.groupId=_id
                    familyGroups.push(familyApplied)
                }else{
                    console.log(family._id,_id)
                }


            }
            family.groups.applied=familyGroups
            Meteor.users.update(family._id,family)
        })
    },
})

/*
 Migrations.add({
 version: 2,
 name: 'Update blue card status" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Meteor.users.find({
 "roles": "family"
 })
 cursor.forEach((family) => {
 Families.update(family._id, {$set: {version: 11}})
 })
 return true
 },
 })


 Migrations.add({
 version: 3,
 name: 'Update phone in emails reports" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Email.find({})
 cursor.forEach((email) => {
 const family = Meteor.users.findOne(email.userId)
 if (family)
 Email.update(email._id, {$set: {mobilePhone: family.parents[0].mobilePhone}})
 })
 return true
 },
 })


 Migrations.add({
 version: 4,
 name: 'Update information groups on families" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Groups.find({})
 cursor.forEach((group) => {
 const familiesApplying = group.familiesApplying || []
 for (let applied of familiesApplying) {
 Families.update(applied.familyId, {$addToSet: {"groups.applied": group._id}})
 }

 })
 return true
 },
 })

 Migrations.add({
 version: 6,
 name: 'Update information groups on families" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Groups.find({})
 cursor.forEach((group) => {
 const availablePlacements = (group.familiesApplying && group.familiesApplying.length) || 0
 Groups.attachSchema(Groups.schemas.edit, {replace: true})
 console.log('availablePlacements', 'availablePlacements')
 if (availablePlacements) {
 Groups.update(group._id, {$set: {availablePlacements}})

 }
 })
 return true
 },
 })


 Migrations.add({
 version: 7,
 name: 'Update files to aws3" ',
 up: function () {//code to migrate up to version 1}
 const version = 3
 const files = Files.collection.find()
 files.forEach((file) => {
 var filePath = 'files/' + file._id + '-original.' + file.extension
 const upd = {$set: {}}
 var cfdomain = 'https://dn369dd0j6qea.cloudfront.net'; // <-- Change to your Cloud Front Domain
 upd['$set']["versions.original.meta.pipeFrom"] = cfdomain + '/' + filePath;
 upd['$set']["versions.original.meta.pipePath"] = filePath;
 upd['$set']["version"] = version;
 const update = Files.collection.update(file._id, upd)
 })
 return true
 },
 })


 Migrations.add({
 version: 8,
 name: 'Update groups information in bluecards and emails reports" ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({"groups.applied.0": {$exists: 1}})
 console.log('--->>', families.count())
 families.forEach((family) => {
 updateGroupCount(family._id)
 })
 return true
 },
 })


 Migrations.add({
 version: 9,
 name: 'Update groups information in bluecards " ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({})
 BlueCard.remove({})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})
 families.forEach((family) => {
 insertBlueCards(family)
 })
 return true
 },
 })

 Migrations.add({
 version: 10,
 name: 'Update groups information in bluecards " ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({})
 for (const template of emailTemplateFixtures) {
 const exists = !!EmailTemplates.find(template._id).count()
 if (!exists) {
 EmailTemplates.insert(template)
 }
 }
 EmailTemplates.update('enrollAccount', {$set: {type: "system", campaign: true}})
 let ids = [
 "resetPassword",
 "verifyEmail",
 "welcomeEmail",
 "ReadyToProcess",
 "BeingProcessed",
 "Declined",
 "Approved",
 "NewApplication",
 "Suspended"]
 EmailTemplates.update({_id: {$in: ids}}, {$set: {type: "system", campaign: false}}, {multi: true})
 }
 })



 Migrations.add({
 version: 11,
 name: 'Recreate token for emails campaing " ',
 up: function () {

 const cursor = Email.find({loggedAt: {$eq: null}}, {limit: 1})
 cursor.forEach((email) => {
 if (email.userId){
 const user=Meteor.users.findOne(email.userId)
 let token = email.text.match(/\[http:\/\/www\.choicehomestay\.com\/enroll\-account\/(\S*)\]/gi)
 if (Array.isArray(token))
 token = token[0]
 token = token.substr(46)
 token = token.substr(0, token.length - 1)
 var when = new Date();
 var tokenRecord = {
 token: token,
 email: email.to,
 when: when,
 reason: 'enroll'
 };
 Meteor.users.update(email.userId, {
 $set: {
 "services.password.reset": tokenRecord
 }
 });
 // before passing to template, update user object with new token
 Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
 }

 })
 }
 })


 Migrations.add({
 version: 12,
 name: 'Recreate token for emails campaing " ',
 up: function () {

 const cursor = Email.find({loggedAt: {$eq: null}})
 cursor.forEach((email) => {
 if (email.userId){
 const user=Meteor.users.findOne(email.userId)
 let token = email.text.match(/\[http:\/\/www\.choicehomestay\.com\/enroll\-account\/(\S*)\]/gi)
 if (Array.isArray(token))
 token = token[0]
 token = token.substr(46)
 token = token.substr(0, token.length - 1)
 var when = new Date();
 var tokenRecord = {
 token: token,
 email: email.to,
 when: when,
 reason: 'enroll'
 };
 Meteor.users.update(email.userId, {
 $set: {
 "services.password.reset": tokenRecord
 }
 });
 // before passing to template, update user object with new token
 Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
 }

 })
 }
 })

 */
/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {_} from 'lodash'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Families} from '/imports/api/family/family'
import {Groups} from '/imports/api/group/group'
import {Meteor} from 'meteor/meteor'
import {Migrations} from 'meteor/percolate:migrations'
import {updateGroupCount} from '/imports/api/group/group'
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
        Meteor.users.update({
            "roles": "family",
            "$or": [{"office.familySubStatus": ""},
                {"office.familySubStatus": {"$not": {"$type": 2}}}]
        }, {$set: {"office.familySubStatus": 'active'}}, {multi: true})
        return true
    },
})
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
            else
                console.log('email.userId', email.userId)
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



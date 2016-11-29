/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {_} from 'lodash'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Families} from '/imports/api/family/family'
import {Meteor} from 'meteor/meteor'
import {Migrations} from 'meteor/percolate:migrations'
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
                console.log('email.userId',email.userId)
        })
        return true
    },
})





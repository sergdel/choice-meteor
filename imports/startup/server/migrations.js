/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {_} from 'lodash'
import {BlueCard} from '/imports/api/blue-card/blue-card'
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
        console.log('migrating', Meteor.users.update({
            "roles": "family",
            "parents.0.blueCard.expiryDate": {$gte: new Date()},
            "parents.0.blueCard.number": {"$type": 2, "$ne": ""},
        }, {$set: {"parents.0.blueCard.status": 'approved'}}, {multi: true}))

        console.log('migrating', Meteor.users.update({
            "roles": "family",
            "parents.1.blueCard.expiryDate": {$gte: new Date()},
            "parents.1.blueCard.number": {"$type": 2, "$ne": ""},
        }, {$set: {"parents.1.blueCard.status": 'approved'}}, {multi: true}))


        return true
    },
})




/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {_} from 'lodash'
import {BlueCard} from '/imports/api/blue-card/blue-card'
Migrations.config({
    log: true
});


Meteor.startup(() => {

    Migrations.migrateTo(2)
})

Migrations.add({
    version: 1,
    name: 'Remove empty second parent',
    up: function () {//code to migrate up to version 1}
        // This is how to get access to the raw MongoDB node collection that the Meteor server collection wraps
        const batch = Meteor.users.rawCollection().initializeUnorderedBulkOp();

        //Mongo throws an error if we execute a batch operation without actual operations, e.g. when Lists was empty.
        let hasUpdates = false;
        const users = Meteor.users.find({
            roles: 'family',
            "parents.1.mobilePhone": {$exists: false},
            "parents.1.blueCardNumber": {$exists: false},
            "parents.1.firstName": {$exists: false}
        })
        users.forEach(family => {
            // We have to use pure MongoDB syntax here, thus the `{_id: X}`
            batch.find({_id: family._id}).updateOne({$set: {parentsCount: 1}, $unset: {"parents.1": ""}});
            hasUpdates = true;
        });
        if (hasUpdates) {
            // We need to wrap the async function to get a synchronous API that migrations expects
            const execute = Meteor.wrapAsync(batch.execute, batch);
            return execute();
        }

        return true;
    }
})



Migrations.add({
    version: 3,
    name: 'Update blue card  Reword "Applying" to "Sent" ',
    up: function () {//code to migrate up to version 1}
        Meteor.users.update({"parents.blueCard.status": 'applying'}, {$set: {"parents.blueCard.status": 'sent'}}, {multi: true})
        Meteor.users.update({"children.blueCard.status": 'applying'}, {$set: {"children.blueCard.status": 'sent'}}, {multi: true})
        Meteor.users.update({"guests.blueCard.status": 'applying'}, {$set: {"guests.blueCard.status": 'sent'}}, {multi: true})
        BlueCard.update({status: "applying"}, {$set: {status: "sent"}}, {multi: true})
        return true
    },


})


Migrations.add({
    version: 5,
    name: 'Update blue card status" ',
    up: function () {//code to migrate up to version 1}
        Meteor.users.find({"roles": "family"}).forEach((family) => {
            Families.update(family._id, {$set: {version: 4}})
        })
        return true
    },


})

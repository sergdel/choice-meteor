/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {_} from 'lodash'

Migrations.config({
    log: true
});


Meteor.startup(()=> {

    Migrations.migrateTo(2)
})

Migrations.add({
    version: 1,
    name: 'Remove empty secod parent',
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
        console.log('users', users.count())
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
    version: 2,
    name: 'Update blue card status',
    up: function () {//code to migrate up to version 1}
        blueCards.forEach((number)=> {
            const users = Meteor.users.find({
                roles: 'family',
                $or: [
                    {"parents.blueCard.number": number},
                    {"children.blueCard.number": number},
                    {"guest.blueCard.number": number}
                ]
            })
            users.forEach((family)=> {
                //console.log(family)
                family.parents = family.parents || []
                family.children = family.children || []
                family.guests = family.guests || []
                const pi = _.findIndex(family.parents, function (person) {
                    return person && person.blueCard && person.blueCard.number == number
                });
                const ci = _.findIndex(family.children, function (person) {
                    return person && person.blueCard && person.blueCard.number == number
                });
                const gi = _.findIndex(family.guests, function (person) {
                    return person && person.blueCard && person.blueCard.number == number
                });
                console.log('pi, ci, gi', pi, ci, gi)
                if (pi >= 0) {
                    let modifier = {$set: {}}
                    modifier.$set["parents." + pi + ".blueCard.status"] = "approved"
                    modifier.$set["parents." + pi + ".blueCard.registered"] = "sponsored"
                    //console.log(pi, family, number, modifier)
                    Meteor.users.update(family._id, modifier)
                }
                if (ci >= 0) {
                    let modifier = {$set: {}}
                    modifier.$set["children." + ci + ".blueCard.status"] = "approved"
                    modifier.$set["children." + ci + ".blueCard.registered"] = "sponsored"
                    //console.log(pi, family, number, modifier)
                    Meteor.users.update(family._id, modifier)
                }
                if (gi >= 0) {
                    let modifier = {$set: {}}
                    modifier.$set["guest." + gi + ".blueCard.status"] = "approved"
                    modifier.$set["guest." + gi + ".blueCard.registered"] = "sponsored"
                    //console.log(pi, family, number, modifier)
                    Meteor.users.update(family._id, modifier)
                }
            })
        })
        return true
    },

})


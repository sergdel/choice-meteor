/**
 * Created by cesar on 30/10/16.
 */

import {BlueCard} from  '/imports/api/blue-card/blue-card'
Meteor.publish('blueCards', function (limit, query = {}, sort = {}) {
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    console.log(limit, query , sort );
    if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
        return [];
    Counts.publish(this, 'blueCardsCounter', BlueCard.find(query, {limit, sort}), {noReady: true});
    console.log('aksljdlkasjdklas',{limit});

    console.log('BlueCard.find(query, {limit, sort})', BlueCard.find(query, {limit, sort}).count());
    return BlueCard.find(query, {limit, sort})
});


Meteor.startup(()=> {
    let cursor = BlueCard.find({expiryDate: {$exists: true}, expiryDate: {$ne: ""}, expiryDate: {$ne: null}});
    if (cursor.count() == 0) {
        BlueCard.remove({});
        cursor = Meteor.users.find({roles: 'family'});
        cursor.forEach((doc)=> {
            Meteor.users.update(doc._id, doc)
        })
    }


});
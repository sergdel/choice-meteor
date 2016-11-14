/**
 * Created by cesar on 30/10/16.
 */

import {moment} from 'meteor/momentjs:moment'
import {BlueCard} from  '/imports/api/blue-card/blue-card'
Meteor.publish('blueCards', function (limit, query = {}, sort = {}) {
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
        return this.ready();
    query = _.extend(query,{dateOfBirth: {$lte: moment().subtract(17.5, 'years').toDate()}})
    Counts.publish(this, 'blueCardsCounter', BlueCard.find(query, {limit, sort}), {noReady: true});
    return BlueCard.find(query, {limit, sort})
});

/*
 Meteor.startup(()=> {
 let cursor = BlueCard.find({expiryDate: {$exists: true}, expiryDate: {$ne: ""}, expiryDate: {$ne: null}});
 if (cursor.count() == 0) {
 BlueCard.remove({});
 cursor = Meteor.users.find({roles: 'family'});
 cursor.forEach((doc)=> {
 Meteor.users.update(doc._id, doc)
 })
 }


 });*/
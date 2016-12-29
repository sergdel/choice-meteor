/**
 * Created by cesar on 18/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {Email} from 'meteor/email'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Groups} from '/imports/api/group/group'

Meteor.startup(function () {
    Email._ensureIndex({ "userId": 1});
    BlueCard._ensureIndex({ "familyId": 1});
    Groups._ensureIndex({ "dates.0": 1});
    Groups._ensureIndex({ "dates.0": -1});
    Groups._ensureIndex({ "dates.1": 1});
    Groups._ensureIndex({ "dates.1": -1});
});

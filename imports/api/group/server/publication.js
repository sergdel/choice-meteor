/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from "meteor/meteor";
import {rowsByPage} from "/imports/api/globals";
import {Groups} from "/imports/api/group/group";

Meteor.publish('group', function (groupId) {
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    if (! Roles.userIsInRole(this.userId,['admin','staff'])) {
        return this.ready();
    }
    return Groups.find(groupId, {fields: Groups.fields})
})

Meteor.publish('groups', function (limit, query = {}, sort = {}) {
    if (!limit) {
        limit = rowsByPage
    }
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    if (! Roles.userIsInRole(this.userId,['admin','staff'])) {
        return this.ready();
    }
    return  Groups.find(query, {limit, sort, fields: Groups.fields})
})


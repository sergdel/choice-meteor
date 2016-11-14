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
    return Groups.find(groupId, {fields: Groups.fields.staff})
})

Meteor.publish('groups', function (limit, query = {}, sort = {}) {
    if (!this.userId) {
        return this.ready()
    }
    if (!limit) {
        limit = rowsByPage
    }

    if (! Roles.userIsInRole(this.userId,['admin','staff'])) {
        fields=Groups.fields.staff
    }else{
        fields=Groups.fields.family
    }
    console.log(Groups.find(query, {limit, sort, fields}).count())
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    return  Groups.find(query, {limit, sort, fields})

})

//query=_.extend(query,{appliedFamilies: {$nin: this.userId} })
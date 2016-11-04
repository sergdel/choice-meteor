/**
 * Created by cesar on 17/10/16.
 */
Meteor.publish('audits', function (limit, query = {}, sort = {}) {
    console.log(AuditLog.find(query, {limit, sort}).fetch());
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    if (!limit) {
        limit = rowsByPage
    }
    if (!Roles.userIsInRole(this.userId, ['admin']))
        return [];

    Counts.publish(this,'auditCounter',AuditLog.find(query, {limit, sort}));
    return AuditLog.find(query, {limit, sort})
});
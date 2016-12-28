/**
 * Created by cesar on 28/9/16.
 */


Meteor.publish('staffs', function () {
    if (!Roles.userIsInRole(this.userId, ['admin','staff']))
        return this.ready();
    return Meteor.users.find({roles: 'staff'})
});

Meteor.publish('staff', function (staffId) {
    if (!Roles.userIsInRole(this.userId, 'admin'))
        return this.ready();
    return Meteor.users.find({_id: staffId, roles: 'staff'})
});
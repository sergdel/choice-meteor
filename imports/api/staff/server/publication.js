/**
 * Created by cesar on 28/9/16.
 */


Meteor.publish('staffs', function () {
    if (!Roles.userIsInRole(this.userId, 'admin'))
        return [];
    return Meteor.users.find({roles: 'staff'})
});
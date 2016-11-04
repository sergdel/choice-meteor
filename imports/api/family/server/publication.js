/**
 * Created by cesar on 28/9/16.
 */

Meteor.publish('families', function (limit, query = {}, sort = {}) {
    console.log(query, {limit, sort});
    Meteor._sleepForMs(800 * Meteor.isDevelopment);
    query.roles = "family";
    if (!limit) {
        limit = rowsByPage
    }
    if (!Roles.userIsInRole(this.userId, ['admin', 'staff']))
        return [];
    const fields = {
        "parents.firstName": 1,
        "parents.surname": 1,
        "contact.address.city": 1,
        "contact.address.suburb": 1,
        parentsCount: 1,
        childrenCount: 1,
        guestsCount: 1,
        bedroomsCount: 1,
        bedsCount: 1,
        "office.tags": 1,
        "office.familyStatus": 1,
        "office.familySubStatus": 1,
        "office.preferredGender": 1,

    };
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        fields["emails.address"] = 1;
        fields["parents.mobilePhone"] = 1;
        fields["contact.homePhone"] = 1
    }
    Counts.publish(this, 'familiesCounter', Meteor.users.find(query, {limit, sort}),{ noReady: true });
    return Meteor.users.find(query, {limit, sort})
});
Meteor.publish('family', function (familyId) {
    console.log('family', familyId);
    const user = Meteor.users.findOne(this.userId); //I don't want to user Roles packages at this tiem because then probably you fave to use meteor.users.find 3 times.
    const userRoles = user.roles;
    if (_.difference(['family', 'admin', 'staff'], userRoles).length == 3) //have no roles
        return [];
    if (_.difference(['family'], userRoles).length == 0) //is family role
        familyId = this.userId;
    AuditLog.insert({
        userId: this.userId,
        docId: familyId,
        action: "findOne",
        collection: "users",
        custom: {
            roles: userRoles,
            name: user.firstName + ' ' + user.surname
        }
    });
    return Meteor.users.find({_id: familyId, roles: 'family'})
});

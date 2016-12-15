/**
 * Created by cesar on 28/9/16.
 */
import {Families} from '/imports/api/family/family'
Meteor.publish('families', function (limit, query = {}, sort = {}) {
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
    Counts.publish(this, 'familiesCounter', Meteor.users.find(query, {limit, sort}), {noReady: true});
    return Meteor.users.find(query, {limit, sort})
});
Meteor.publish('familyContactInfo', function (familyId) {

    if (!Roles.userIsInRole(this.userId,['admin','staff']))
        return this.ready()

    return Families.findContact(familyId,this.userId)
})
Meteor.publish('family', function (familyId) {
    const user = Meteor.users.findOne(this.userId); //I don't want to user Roles packages at this tiem because then probably you have to use meteor.users.find 3 times.
    if (!user) {
        return this.ready()
    }
    const userRoles = user.roles;
    let fields = {}
    if (_.difference(['family', 'admin', 'staff'], userRoles).length == 3) //have no roles
        return [];
    if (_.difference(['family'], userRoles).length == 0) {
        fields = {
            office: 0,
        }
    }//is family role
    const cursor = Families.find(familyId, {fields, userId: this.userId})

    const family = cursor.fetch()[0]
    if (!family)
        return this.ready()
    const familyFiles = (family.files || [])
    const adultFiles = (family.adult && family.adult.files || [])
    const officeFiles = (family.office && family.office.files || [])
    const files = _.union(familyFiles, adultFiles, officeFiles)
    return [cursor, Files.collection.find({_id: {$in: files}})]
});

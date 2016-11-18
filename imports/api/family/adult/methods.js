/**
 * Created by cesar on 3/10/16.
 */

Meteor.methods({
    adultEdit(modifier, familyId){
        this.unblock()

        if (Meteor.isServer) Meteor._sleepForMs(300 * Meteor.isDevelopment);
        if (Roles.userIsInRole(this.userId, ['family'])) {
            if (familyId != this.userId)
                throw new Meteor.Error(403, 'Access forbidden', 'Users can only edit their own profile')
        }
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            if (modifier && modifier.$set && modifier.$set.adult && modifier.$set.adult.status){
                throw new Meteor.Error(403, 'Access forbidden', 'Only staff can change status')
            }
            if (familyId != this.userId)
                throw new Meteor.Error(403, 'Access forbidden', 'Only admin and staff and update profile')
        }
        //TODO HAY QUE HACER QUE CUANDO ALGUIEN META SUS DATOS PRO PIRMERA VEZ SALGA COMO APLICANDO
        //PROBABLEMENTE SCHEMA CLEAR OR ALGO ASI

        return Meteor.users.update(familyId, modifier)

    }
});
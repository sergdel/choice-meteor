/**
 * Created by cesar on 15/12/16.
 */
import {Meteor} from 'meteor/meteor'
import {Locations} from '/imports/api/location/location'
import {check} from 'meteor/check'


Meteor.publish('location', function (locationId) {
    check(locationId,String)
    if (!this.userId){
        return this.ready()
    }
    return Locations.find(locationId)
})

Meteor.publish('locations', function () {
    if (!this.userId){
        return this.ready()
    }
    return Locations.find()
})


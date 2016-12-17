/**
 * Created by cesar on 15/12/16.
 */
import {Meteor} from 'meteor/meteor'
import {Families} from '/imports/api/family/family'
import {Locations} from '/imports/api/location/location'
import {Distances} from '/imports/api/location/location'
import {locationSchema} from "/imports/api/location/location";
import {check} from 'meteor/check'
import {HTTP} from 'meteor/http'

Meteor.methods({
    locationExists: function (name) {
        return Locations.find({name}).count() != 0
    },
    locationNew: function (doc) {
        check(doc, locationSchema)
        if (Meteor.call('locationExists', doc.name)) {
            throw new Meteor.Error(400, 'Location exists')
        }
        if (!Roles.userIsInRole(this.userId, ['admin'])) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only admin can create locations')
        }
        return Locations.insert(doc)
    },
    locationEdit: function (modifier, locationId) {
        check(locationId, String)
        check(modifier, Object)

        if (!Roles.userIsInRole(this.userId, ['admin'])) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only admin can create locations')
        }
        locationSchema.newContext("locationEdit").validate(modifier, {modifier: true});
        locationSchema.clean(modifier, {isModifier: true});
        const oldLocation = Locations.findOne(locationId)
        const oldLat = (oldLocation && oldLocation.address && oldLocation.address.lat)
        const oldLng = (oldLocation && oldLocation.address && oldLocation.address.lng)
        const lat = modifier.$set['address.lat'] || oldLat
        const lng = modifier.$set['address.lng'] || oldLng

        console.log('lat lng', lat, lng)
        Locations.update(locationId, modifier)
        this.unblock()
        if (lat != oldLat || lng != oldLng) {
            Meteor.setTimeout(() => {
                Families.find({}, {}).forEach((family) => {
                    updateDistance(family,locationId)
                })

            }, 1000)
        }
        return locationId
    }
})

export const updateDistance=function(family,location){
    if (family.contact && family.contact.address && family.contact.address.lng && location && location.address && location.address.lat) {
        const locationId=location._id
        const familyId = family._id
        if (Meteor.isProduction) Meteor._sleepForMs(250);
        const response = HTTP.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${location.address.lat},${location.address.lng}&origins=${family.contact.address.lat},${family.contact.address.lng}&key=AIzaSyDREfT4Rypm8BD2TqwK-8tAHvAQ46Nswbg`)
        if (response.statusCode == 200) {

            const travel = response.data && response.data.rows && response.data.rows[0]  && response.data.rows[0].elements  && response.data.rows[0].elements[0]

            if (travel && travel.status == 'OK') {
                delete travel.status
                travel.duration.value=travel.duration.value/60
                travel.distance.value=travel.duration.value/1000
                Distances.upsert(family._id + '|' + locationId, {familyId, locationId, travel})
                if (Meteor.isDevelopment) console.log(family._id + '|' + locationId)
            }
        }
    }
}

/*
 console.log('distance ***************************************',distance)
 if (!distance) {
 const location = Locations.findOne(locationId)
 const family = Families.findOne(familyId,{fields: {contact: 1}})
 console.log('location family ***************************************',location,family)
 if (family.contact && family.contact.address && family.contact.address.lng && location && location.address && location.address.lat) {
 const response = HTTP.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${location.address.lat},${location.address.lng}&origins=${family.contact.address.lat},${family.contact.address.lng}&key=AIzaSyDREfT4Rypm8BD2TqwK-8tAHvAQ46Nswbg`)
 const travel = response.data && response.data.rows && response.data.rows[0] && response.data.rows[0].elements && response.data.rows[0].elements[0]
 const status = travel && travel.status
 console.log('travel ***************************************',travel)
 if (response.statusCode == 200 && status == 'OK') {
 delete travel.status
 distance = {
 _id: family._id + '|' + locationId,
 familyId,
 locationId,
 travel
 }

 }
 Distances.insert(distance)
 } else {
 distance = {
 _id: family._id + '|' + locationId,
 familyId,
 locationId
 }
 Distances.insert(distance)
 }
 }

 */
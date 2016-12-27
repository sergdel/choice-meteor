/**
 * Created by cesar on 17/12/16.
 */
/**
 * Created by cesar on 17/11/16.
 */
var Fiber = Npm.require('fibers');
var Faker = require('Faker');
import {Families} from '/imports/api/family/family'
import {Email} from 'meteor/email'
import {_} from 'meteor/underscore'
import {Random} from 'meteor/random'
WebApp.connectHandlers.use("/fakefy", function (req, res, next) {
    if (req.headers.host == "localhost:3000" || req.headers.host == "dev.choicehomestay.com.au" || req.headers.host == "dev.choicehomestay.com") {
        Families.find().forEach((family) => {
            for (let i = 0; i <= 5; i++) {
                for (const person of ['parents', 'children', 'guests']) {
                    const email = Faker.Internet.email()
                    if (family.emails && family.emails[i] && family.emails[i].address) family.emails[i].address = email
                    if (family[person] && family[person][i]) {
                        if (family[person][i].email) family[person][i].email = email
                        if (family[person][i].firstName) family[person][i].firstName = Faker.Name.firstName()
                        if (family[person][i].surname) family[person][i].surname = Faker.Name.lastName()
                        if (family[person][i].mobilePhone) family[person][i].mobilePhone = Faker.PhoneNumber.phoneNumber()
                    }
                }
            }
            if (family.contact && family.contact.homePhone) family.contact.homePhone = Faker.PhoneNumber.phoneNumber()
            if (family.contact && family.contact.address && family.contact.address.fullAddress) {
                const lat = family.contact && family.contact.address && family.contact.address.lat
                const lng = family.contact && family.contact.address && family.contact.address.lng
                family.contact.address = {
                    street: Faker.Address.streetName(),
                    suburb: Faker.Address.ukCounty(),
                    city: Faker.Address.city(),
                    state: Faker.Address.usState(),
                    country: Faker.Address.ukCountry(),
                    zip: Faker.Address.zipCode(),
                    lat: lat,
                    lng: lng,

                    fullAddress: Faker.Address.streetAddress(),
                    placeId: Random.id(),
                }
                if (lat && lng) {
                    family.contact.address.geometry = {
                        type: "Point",
                        coordinates: [lng, lat]
                    }
                }
            }
            family.bank = {
                "bankName": "CITI",
                "accountName": "CHECK",
                "accountBSB": "0000",
                "accountNumber": "00000000"
            }
            Families.update(family._id, family)
        })
    }
    Email.update({}, {$unset: {to: ''}}, {multi: 1})

    res.writeHead(200);
    res.end("Hello world from: " + Meteor.release);
})
;
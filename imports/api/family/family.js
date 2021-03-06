/**
 * Created by cesar on 26/9/16.
 */
import  {LocalCollection} from 'meteor/minimongo'
import {childSchema} from "./children";
import {guestSchema} from "./guests";
import {parentSchema} from "./parents";
import {contactSchema} from "./contact";
import {petSchema} from "./pets";
import {bedroomSchema} from "./bedrooms";
import {bankSchema} from "./bank";
import {otherSchema} from "./others";
import {officeSchema} from "./office";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {adultSchema} from "./adult/adult";
import {_} from "meteor/underscore";
import {moment} from "meteor/momentjs:moment";
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Audit} from '/imports/api/audit/audit'
import {Tags} from '/imports/api/tags/tags'
import {updateDistance} from "/imports/api/location/methods";
import {availabilitySchema} from "./availability";
import {Locations} from "/imports/api/location/location";
import {Groups} from "/imports/api/group/group";
export const emailSchema = new SimpleSchema({
    email: {
        label: "E-mail address",
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("emailExist", this.value, function (error, result) {
                    if (result) {
                        emailSchema.namedContext("familyNew").addInvalidKeys([{name: "email", type: "notUnique"}]);
                    }
                });
            }
        }
    }
})
export const updateGroupCountForAllFamilies = function () {
    const time = new Date()
    Families.find({}).forEach((family) => {
        updateGroupCount(family._id)
    })
    console.log('updateGroupCountForAllFamilies time: ', new Date() - time)
}
export const createAvailableQuery = function (confirmedGroups = [], unavailability = [], and = []) {
    confirmedGroups.forEach((confirmed) => {
        if (confirmed.dates && confirmed.dates[0] && confirmed.dates[1] && confirmed.dates[0] instanceof Date && confirmed.dates[1] instanceof Date) {
            and.push({
                //dates0 and dates1 can not be between a confirmed group
                "dates.0": {$not: {$gte: confirmed.dates[0], $lte: confirmed.dates[1]}},
                "dates.1": {$not: {$gte: confirmed.dates[0], $lte: confirmed.dates[1]}},
                //dates and wrapped a dates of confirmed group
                $or: [
                    {"dates.0": {$gte: confirmed.dates[1]}},
                    {"dates.1": {$lte: confirmed.dates[0]}}
                ]
            })
        }
    })
    unavailability.forEach((dates) => {
        dates = dates && dates.dates
        if (dates && dates[0] && dates[1] && (dates[0] instanceof Date) && (dates[1] instanceof Date)) {
            and.push({
                //dates0 and dates1 can not be between a confirmed group
                "dates.0": {$not: {$gte: dates[0], $lte: dates[1]}},
                "dates.1": {$not: {$gte: dates[0], $lte: dates[1]}},
                //dates and wrapped a dates of confirmed group
                $or: [
                    {"dates.0": {$gte: dates[1]}},
                    {"dates.1": {$lte: dates[0]}}
                ]
            })
        }
    })
    and.push({enabled: true})
    return {$and: and}
}


export const Families = {}
Families.findContact = function (familyId, userId) {
    Audit.insert({type: 'accessInfo', docId: familyId, familyId, userId})
    return Meteor.users.find(familyId, {
        fields: {
            "emails.address": 1,
            "contact.homePhone'": 1,
            "parents.mobilePhone": 1,
            "roles": 1,

        }
    })
}
Families.updateNotes = function (blueCardId, notes) {
    Meteor.users.update({"parents.blueCard.id": blueCardId}, {$set: {"parents.$.blueCard.notes": notes}})
    Meteor.users.update({"children.blueCard.id": blueCardId}, {$set: {"children.$.blueCard.notes": notes}})
    Meteor.users.update({"guests.blueCard.id": blueCardId}, {$set: {"guests.$.blueCard.notes": notes}})
    BlueCard.update(blueCardId, {$set: {notes: notes}})
}
export const updateGroupCount = function (familyId) {
    //let time = new Date()

    const family = Families.findOne(familyId, {fields: {availability: 1, groups: 1}})
    const appliedCount = (family && family.groups && _.where(family.groups, {status: 'applied'}).length) || 0
    const confirmedGroups = _.where(family.groups, {status: 'confirmed'})
    const confirmedCount = (family && family.groups && confirmedGroups.length) || 0
    const confirmedIds = _.pluck(confirmedGroups, 'groupId')
    const confirmedGroupsCollection = Groups.find({_id: {$in: confirmedIds}}, {dates: 1}).fetch()
    const availableQuery = createAvailableQuery(confirmedGroupsCollection, family.availability)
    const available = Groups.find(availableQuery).count()
    Meteor.users.update(familyId, {
        $set: {
            "groupsCount.applied": appliedCount,
            "groupsCount.confirmed": confirmedCount,
            "groupsCount.available": available
        }
    })
    //console.log('users time: ', new Date() - time)
    time = new Date()
    BlueCard.update({familyId}, {$set: {applied: appliedCount, confirmed: confirmedCount, available}}, {multi: true})
    //console.log('BlueCard time: ', new Date() - time)
    time = new Date()
    Email.update({userId: familyId}, {$set: {applied: appliedCount, confirmed: confirmedCount, available}}, {multi: true})
    //console.log('Email time: ', new Date() - time)
}
/** when a groups is removed**/
Families.removeGroups = function (groupId) {
    const affectedFamilies = Meteor.users.find({"groups": {$elemMatch: {groupId: groupId}}}, {fields: {_id: 1}}).fetch()

    const ids = _.pluck(affectedFamilies, '_id')
    Meteor.users.update({"groups.groupId": groupId,}, {$pull: {"groups": {groupId}}})
    affectedFamilies.forEach((family) => {
        updateGroupCount(family._id)
    })
    return Meteor.users.update({"groups.groupId": groupId}, {$pull: {"groups": {groupId}}}, {multi: true})
}
Families.cancelGroup = function (familyId, groupId) {
    const result = Meteor.users.update(familyId, {$pull: {"groups": {groupId}}})
    updateGroupCount(familyId)
    return result

}
Families.updateGroupStatusTo = function (status, familyId, groupId) {
    Meteor.users.update({_id: familyId, "groups.groupId": groupId}, {$set: {"groups.$.status": status}})
    updateGroupCount(familyId)
}
Families.applyGroup = function (familyId, groupId, data, status) {
    const dataWithData = _.clone(data)
    dataWithData.groupId = groupId
    dataWithData.status = status
    Meteor.users.update(familyId, {$pull: {"groups": {groupId}}})
    const result = Meteor.users.update(familyId, {
        $addToSet: {"groups": dataWithData}
    })
    updateGroupCount(familyId)
    return result
}
Families.find = function (selector = {}, options) {
    if (typeof selector === 'string')
        Audit.insert({type: 'access', docId: selector, familyId: selector, userId: options.userId})
    selector = _.extend(selector, {roles: 'family'})
    return Meteor.users.find(selector, options)
}
Families.findOne = (_id, options) => {
    return Meteor.users.findOne({_id, roles: 'family'}, options)
}
Families.insert = function (email, options) {
    const familyId = Accounts.createUser({email})
    Families.updateBySelector(familyId, {
        $set: {
            roles: ['family'],
            "office.familyStatus": 0,
            "office.firstVisit.staffId": '-',
            "parents": [{"email": email}],
            "groupsCount.applied": 0,
            "groupsCount.confirmed": 0,
            "groupsCount.available": 0,
        }
    })

    Audit.insert({type: 'create', docId: familyId, userId: options.userId, familyId: familyId})
    return familyId
}
Families.updateBySelector = function (selector, modifier, options) {
    return Meteor.users.update(selector, modifier, options);
}
Families.update = function (_id, modifier, options = {}, callback) {
    if (typeof _id != 'string') {
        throw new Meteor.Error('Use only _id as selector for Families collection, otherwise use updateBySelector')
    }
    const oldDoc = Meteor.users.findOne(_id)

    // in family profile there are no information about status, notes or geristered bluecards, then if a family role save the infomation
    //will be lostr theses fields, Thats why we merge the old info in the modifier


    mergeOldBlueCardInfo(oldDoc, modifier);


    const updated = Meteor.users.update(_id, modifier, options, callback)
    if (!updated) throw new Meteor.Error(404, 'Family not found', '_id: ' + _id)
    const newDoc = Meteor.users.findOne(_id)
    //todo change that to next line (now is having problem with a infitite cycle
    //todo do the log here
    //LocalCollection._modify(newDoc, modifier)


    setBlueCardStatus(newDoc)
    insertBlueCards(newDoc)
    newDoc.unavailabilityCount=(newDoc.availability && newDoc.availability.length) || 0
    Meteor.users.update(_id, newDoc, options)

    //if avaliability change
    if (!_.isEqual(newDoc.availability || [], oldDoc.availability || [])) {
        updateGroupCount(_id)
    }

    //if the geoposition change updates the distances
    if ((newDoc && newDoc.contact && newDoc.contact.address && newDoc.contact.address.lat) && (newDoc && newDoc.contact && newDoc.contact.address && newDoc.contact.address.lng) &&
        ((newDoc && newDoc.contact && newDoc.contact.address && newDoc.contact.address.lat) != (oldDoc && oldDoc.contact && oldDoc.contact.address && oldDoc.contact.address.lat) ||
        (newDoc && newDoc.contact && newDoc.contact.address && newDoc.contact.address.lng) != (oldDoc && oldDoc.contact && oldDoc.contact.address && oldDoc.contact.address.lng))
    ) {
        Locations.find().forEach((loc) => {
            updateDistance(newDoc, loc)
        })

    }
    Email.update({userId: _id}, {
        $set: {
            mobilePhone: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].mobilePhone,
            parent1: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].firstName,
            paren2: newDoc && newDoc.parents && newDoc.parents[1] && newDoc.parents[1].firstName,
            surname: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].surname
        }
    }, {multi: true})

    Tags.insert(newDoc && newDoc.office && newDoc.office.tags)

    if (options.userId)
        Audit.insert({type: 'update', docId: _id, newDoc, oldDoc, userId: options.userId, familyId: _id})
    return true
}
Families.upsert = function (_id, modifier, options, callback) {
    return //
}
Families.remove = function (_id, options) {
    Audit.insert({type: 'remove', docId: _id, familyId: _id, userId: options.userId})
    return Meteor.users.remove(_id)
}
export const familySchema = new SimpleSchema({
    createdAt: {
        optional: true,
        type: Date
    },
    loggedAt: {
        optional: true,
        type: Date
    },
    reviewed: {
        optional: true,
        type: Date
    },
    parents: {
        minCount: 1,
        autoform: {
            initialCount: 1,
        },
        type: [Object],
    },
    "parents.$": {
        type: parentSchema,

        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    contact: {
        optional: true,
        type: contactSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }

    },
    children: {
        optional: true,
        type: [Object],

    },
    "children.$": {
        type: childSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },

    guests: {
        optional: true,
        type: [Object],

    },
    "guests.$": {
        type: guestSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    pets: {
        optional: true,
        type: [Object],

    },
    "pets.$": {
        type: petSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },

    bedrooms: {
        optional: true,
        type: [Object],

    },
    "bedrooms.$": {
        type: bedroomSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    bank: {
        optional: true,
        type: bankSchema
    },

    other: {
        optional: true,
        type: otherSchema
    },

    office: {
        optional: true,
        type: officeSchema
    },
    adult: {
        optional: true,
        type: adultSchema,
        autoform: {
            afFieldInput: {
                label: false
            },
            atts: {
                label: false,
                template: "bootstrap3"
            },
            afFormGroup: {
                label: false,
                template: "bootstrap3",
            }
        }
    },
    files: {
        label: "Files",
        type: [String],
        optional: true,

    },
    "files.$": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
            }
        }
    },
    quickNote: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                rows: 3
            },
        }
    },
    notes: {
        type: [Object],
        optional: true,
    },
    "notes.$.note": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                rows: 3
            },
            afFormGroup: {
                template: "bootstrap3",
            }
        }
    },
    "notes.$.date": {
        optional: true,
        type: Date,
        autoform: {
            type: 'readonly',
            afFieldInput: {
                type: "datetime-local",
                readonly: true
            },
            afFormGroup: {
                readonly: true,
                template: "bootstrap3",
            }
        },
        autoValue: function () {
            return new Date()
        }

    },
    "availability": {
        label: 'Unavailable dates',
        optional: true,
        type: Array,
    },
    "availability.$": {
        optional: true,
        type: availabilitySchema
    },
    groupsCount: {
        type: Object,
        optional: true,
    },
    "groupsCount.applied": {
        optional: true,
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        }
    },
    "groupsCount.confirmed": {
        optional: true,
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        }
    },
    "groupsCount.available": {
        optional: true,
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        }
    },
    unavailabilityCount:{
        optional: true,
        type: Number,
        autoValue: function () {
            if (this.isInsert) {
                return 0
            }
        }
    }
});


familySchema.messages({
    notUnique: "[label] already exist",
    required: "Please complete this field",
});


export const setBlueCardStatus = function (family) {
    const map = ["n/a", "approved", "excempt", "send", "sent", "apply", "reapply", "expiring", "expired", "declined"];
    let min = 0
    for (let type of ['parents', 'children', 'guests']) {
        if (family && Array.isArray(family[type])) {
            for (let i in family[type]) {
                if (!(family && family[type] && family[type][i]))
                    continue
                family[type][i].blueCard = family[type][i].blueCard || {status: 'apply'}
                if ((family[type][i].blueCard && !family[type][i].blueCard.expiryDate) || !family[type][i].blueCard.number) {
                    // family[type][i].blueCard.status = "apply"
                }
                if (family[type][i].birthOfDate && family[type][i].birthOfDate > moment().subtract(17.5, 'years')) {
                    // family[type][i].blueCard.status = "n/a"
                }
                if ((family[type][i].blueCard.expiryDate && family[type][i].blueCard.expiryDate <= new Date())) {
                    //  family[type][i].blueCard.status = "expired"
                }
                if (family[type][i].blueCard.expiryDate >= new Date() && family[type][i].blueCard.number) {
                    // family[type][i].blueCard.status = "approved"
                }
                // calc the minumin of status for set in generalstatus

                const level = _.indexOf(map, family[type][i].blueCard.status)
                if (min <= level) {
                    min = level
                }
            }
        }
    }
    family.blueCardStatus = map[min]
    return family
}


export const insertBlueCards = function (family) {
    //BlueCard.remove({familyId: family._id})
    const blueCardIds = []
    for (let type of ['parents', 'children', 'guests']) {
        if (Array.isArray(family[type])) {
            for (let i in family[type]) {
                const member = family[type][i]
                if (!member) continue
                let surname = member.surname
                if (type == 'children') surname = family.parents && family.parents[0] && family.parents[0].surname
                const blueCard = {
                    familyId: family._id,
                    firstName: member.firstName,
                    surname,
                    dateOfBirth: member.dateOfBirth,
                    number: member.blueCard && member.blueCard.number ? member.blueCard.number : undefined,
                    expiryDate: member.blueCard && member.blueCard.expiryDate ? member.blueCard.expiryDate : undefined,
                    status: member.blueCard && member.blueCard.status ? member.blueCard.status : undefined,
                    registered: member.blueCard && member.blueCard.registered ? member.blueCard.registered : undefined,
                    notes: member.blueCard && member.blueCard.notes ? member.blueCard.notes : undefined,
                    type,
                    applied: (family.groups && _.where(family.groups, {status: 'applied'}).length) || undefined

                }
                if (member.blueCard && member.blueCard.id) {
                    BlueCard.update(member.blueCard.id, {$set: blueCard})
                } else {
                    const blueCardId = BlueCard.insert(blueCard)
                    family[type][i].blueCard = family[type][i].blueCard || {}
                    family[type][i].blueCard.id = blueCardId
                }
                blueCardIds.push(family[type][i].blueCard.id)
            }
        }
    }
    BlueCard.remove({_id: {$nin: blueCardIds}, familyId: family._id})
}


export const setArrayCount = function (family) {
    family.parentsCount = family.parents ? family.parents.length : 0
    family.childrenCount = family.children ? family.children.length : 0
    family.bedroomsCount = family.bedrooms ? family.bedrooms.length : 0
    family.petsCount = family.pets ? family.pets.length : 0
    family.guestsCount = family.guests ? family.guests.length : 0
    let numberOfBeds = 0;
    family.bedrooms = family.bedrooms || []
    for (let i in family.bedrooms) {
        numberOfBeds = numberOfBeds + family.bedrooms[i].numberOfBeds
    }
    family.numberOfBeds = numberOfBeds
    return family
}

export const setFamilyScore = function (family) {
    family.familyScore = ((family.office && family.office.familyScore ? family.office.familyScore : 0) + (family.office && family.office.homeScore ? family.office.homeScore : 0)) / 2
    return family.familyScore

}
const mergeOldBlueCardInfo = function (oldDoc, modifier) {
    for (let type of ['parents', 'children', 'guests']) {
        if (modifier.$set[type]) {
            for (let i in modifier.$set[type]) {
                if (modifier.$set[type][i] && modifier.$set[type][i].blueCard) {
                    const notesOld = (oldDoc && oldDoc[type] && oldDoc[type][i] && oldDoc[type][i].blueCard && oldDoc[type][i].blueCard.notes)
                    const notesNew = modifier.$set[type][i].blueCard.notes
                    modifier.$set[type][i].blueCard.notes = notesNew ? notesNew : notesOld

                    const statusOld = oldDoc && oldDoc[type] && oldDoc[type][i] && oldDoc[type][i].blueCard && oldDoc[type][i].blueCard.status
                    const statusNew = modifier.$set[type][i].blueCard.status
                    modifier.$set[type][i].blueCard.status = statusNew ? statusNew : statusOld

                    const registeredOld = oldDoc && oldDoc[type] && oldDoc[type][i] && oldDoc[type][i].blueCard && oldDoc[type][i].blueCard.registered
                    const registeredNew = modifier.$set[type][i].blueCard.registered
                    modifier.$set[type][i].blueCard.registered = registeredNew ? registeredNew : registeredOld
                }
            }
        }
    }
}


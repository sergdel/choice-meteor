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

export const Families = {}
Families.find = function (selector = {}, options) {
    if (typeof selector === 'string')
        Audit.insert({type: 'access', docId: selector, userId: options.userId})
    selector = _.extend(selector, {roles: 'family'})
    return Meteor.users.find(selector, options)
}
Families.findOne = (_id, options) => {

    return Meteor.users.findOne({_id, roles: 'family'}, options)
}
Families.insert = function (email, options) {
    const familyId = Accounts.createUser({email})
    Meteor.users.update(familyId, {$set: {roles: ['family'], "parents": [{"email": email}]}})
    Audit.insert({type: 'create', docId: familyId, userId: options.userId})
    return familyId
}
Families.update = function (_id, modifier, options = {}, callback) {
    const oldDoc = Meteor.users.findOne(_id)



    const updated = Meteor.users.update(_id, modifier, options, callback)
    if (!updated) throw new Meteor.Error(404, 'Family not found', '_id: ' + _id)
    const newDoc = Meteor.users.findOne(_id)
    //todo change that to next line (now is having problem with a infitite cycle
    //todo do the log here
    //LocalCollection._modify(newDoc, modifier)
    let time = new Date().getTime()

    setBlueCardStatus(newDoc)
    insertBlueCards(newDoc)
    Meteor.users.update(_id, newDoc, options)
    //todo hacer esto con joins probablemente con un helper https://guide.meteor.com/collections.html#collection-helpers
    //una  moificacion al autotable donde permita custom publish
    // y
    Email.update({userId: _id},{$set:{
        mobilePhone: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].mobilePhone,
        parent1: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].firstName,
        paren2: newDoc && newDoc.parents && newDoc.parents[1] && newDoc.parents[0].firstName,
        surname: newDoc && newDoc.parents && newDoc.parents[0] && newDoc.parents[0].surname
    }},{multi:true})

    Tags.insert(newDoc && newDoc.office && newDoc.office.tags)

    if (options.userId)
        Audit.insert({type: 'update', docId: _id, newDoc, oldDoc, userId: options.userId})
    return true
}
Families.upsert = function (_id, modifier, options, callback) {
    return //
}
Families.remove = function (_id,options) {
    console.log('Families.removem',_id)
    Audit.insert({type: 'remove', docId: _id, userId: options.userId})
    return Meteor.users.remove(_id)
}
export const familySchema = new SimpleSchema({
    createdAt: {
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

});


familySchema.messages({
    notUnique: "[label] already exist",
    required: "Please complete this field",
});


export const setBlueCardStatus = function (family) {
    const map = ["n/a", "approved", "excempt", "send", "sent", "apply", "reapply", "expired", "declined"];
    let min = 0
    for (let type of ['parents', 'children', 'guests']) {
        if (Array.isArray(family[type])) {
            for (let i in family[type]) {
                if (!(family && family[type] && family[type][i]))
                    continue
                //family[type][i].blueCard = family[type][i].blueCard || {status: 'apply'}

                if (!family[type][i].blueCard.expiryDate || !family[type][i].blueCard.number) {
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
    BlueCard.remove({familyId: family._id})
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
                    type,

                }
                BlueCard.insert(blueCard)
            }
        }
    }
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


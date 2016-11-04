/**
 * Created by cesar on 4/10/16.
 */
import {familySchema} from "../imports/api/family/family";
import {_} from "meteor/underscore";
import moment from 'moment'
var Fiber = Npm.require('fibers');

WebApp.connectHandlers.use("/import", function (req, res, next) {
    //res.end('xxx')
    //return

    var fs = require('fs');
    var parse; //= require('csv-parse');
    var i = 0;
    var csvData = [];
    let keys, rows = [], o = {};
    var fiber = Fiber.current;
    let response = HTTP.get('http://cesarramos.me/newlist.csv');
    if (response.statusCode == 200) {
        let data = response.content;
        const lines = data.split('\n');
        keys = lines[0].split(';');
        for (i = 1; i < lines.length; i++) {
            const values = lines[i].split(';');
            for (let k in keys) {
                o[keys[k]] = values[k]
            }
            rows.push(o);
            o = {}
        }
        insert(rows,res)

    }
    res.end('xx')
});

const insert = function (rows,res) {

    let i, obj;
    for (i = 0; i < rows.length; i++) {
        obj = rows[i];

        if (!obj["Email"]){
            continue
        }
        var familyStatus;
        switch (cleanObj(obj["Status"]).toLowerCase()) {
            case "approved":
                familyStatus = 3;
                break;
            case "declined":
                res.write('db.users.update({"emails.address": "'+obj['Email']+'"},{$set: {"office.familyStatus": 4 }});\n');
                familyStatus = 4;
                break;
            case "suspended":
                familyStatus = 5

        }

        var children = [];


        for (j = 1; j <= 6; j++) {
            if (cleanObj(obj["Child " + j + " Name"]))
                children.push({
                    firstName: cleanObj(obj["Child " + j + " Name"]),
                    gender: getGender(cleanObj(obj["Child " + j + " Gender"])),
                    dateOfBirth: getDate(cleanObj(obj["Child " + j + " DOB"])),
                    nameOfSchool: cleanObj(obj["children school"]),
                    blueCardNumber: cleanObj(obj["Child " + j + " BC #"]),
                    blueCardExpiry: getDate(obj["Child " + j + " BC Exp"]),
                })
        }
        var pets = [];
        for (j = 1; j <= cleanObj(obj["Inside Dog"]); j++)
            pets.push({type: 'Dog', status: 'Indoor'})
        for (j = 1; j <= cleanObj(obj["Outside Dog"]); j++)
            pets.push({type: 'Dog', status: 'Outdoor'})
        for (j = 1; j <= cleanObj(obj["Inside Cat"]); j++)
            pets.push({type: 'Cat', status: 'Indoor'})
        for (j = 1; j <= cleanObj(obj["Outside Cat"]); j++)
            pets.push({type: 'Cat', status: 'Outdoor'})


        var guests = [];
        for (j = 1; j <= 5; j++) {
            if (cleanObj(obj["Guest " + j + " Name"]))
                guests.push({
                    firstName: cleanObj(obj["Guest " + j + " Name"]),
                    surname: cleanObj(obj[""]),
                    gender: getGender(obj["Guest " + j + " Gender"]),
                    dateOfBirth: getDate(obj["Guest " + j + " DOB"]),
                    blueCardNumber: cleanObj(obj["Guest " + j + " BC #"]),
                    blueCardExpiry: getDate(obj["Guest " + j + " BC Exp"]),
                })
        }

        var bedrooms = [];
        var numberOfBeds = 0;
        var bedsCount = 0;
        for (j = 1; j <= 4; j++) {
            numberOfBeds = getInteger(obj["Bedroom " + j + " holds"]);
            if (numberOfBeds > 0) {
                bedrooms.push({numberOfBeds})
            }
        }
        var user = {

            parents: [{
                firstName: cleanObj(obj["Mother's Name"]),
                surname: cleanObj(obj["Family Name"]),
                gender: "female",
                mobilePhone: cleanObj(obj["Mother's Mobile"]),
                blueCardNumber: cleanObj(obj["Mother BC #"]),
                blueCardExpiryDate: getDate(obj["Mother BC Exp"]),
                email: cleanObj(obj["Email"]),
            }, {
                firstName: cleanObj(obj["Father's Name"]),
                surname: cleanObj(obj["Family Name"]),
                gender: "male",
                mobilePhone: cleanObj(obj["Father's Mobile"]),
                blueCardNumber: cleanObj(obj["Father BC #"]),
                blueCardExpiryDate: getDate(obj["Father BC Exp"]),
                email: cleanObj(obj["Email"]),
            }],
            contact: {
                homePhone: cleanObj(obj["Home Phone"]),
                address: {
                    fullAddress: cleanObj(obj["Street Address"]) + ', ' + cleanObj(obj["Suburb"]) + '. ' + cleanObj(obj["City"]) + '. ' + cleanObj(obj["P.Code"]) + '. Australia',
                    street: cleanObj(obj["Street Address"]),
                    city: cleanObj(obj["City"]),
                    zip: cleanObj(obj["P.Code"]),
                    suburb: cleanObj(obj["Suburb"]),
                    country: cleanObj(obj["Street Address"]),
                }
            },
            children,
            guests,
            pets,
            bedrooms,
            bank: {
                bankName: cleanObj(obj["Name of Bank"]),
                accountName: cleanObj(obj["Bank ACC Name"]),
                accountBSB: cleanObj(obj["Bank ACC BSB"]),
                accountNumber: cleanObj(obj["Bank ACC Number"]),
            },
            other: {
                preferredGender: preferredGender(cleanObj(obj["Gender Pref"])),
                wiFiInternet: (cleanObj(obj["Internet provided"]) == "Yes") ? true : false,
                schoolTransport: (cleanObj(obj["Pick up & drop-off"]) == "Yes") ? true : false,
                indoorSmoking: (cleanObj(obj["Smoking ok inside?"]) == "Yes") ? true : false,
                dietaryNotes: cleanObj(obj["Dietary Notes"]),
                familyInterests: cleanObj(obj["Interests"]),
            },
            office: {
                familyStatus,
                familySubStatus: getfamilySubStatus(obj["Substatus"]),
                familyScore: getFloat(obj["Family Score"]),
                homeScore: getFloat(obj["House Score"]),
                tags: [],
            },

        };

        //check(user, familySchema)
        //familySchema.validate(user)
        var myContext = familySchema.newContext();
        myContext.validate(user);
        const err = myContext.invalidKeys();
        if (err.length > 0) {
            console.log('***************************************', cleanObj(obj["Email"]), err)

        }


        let userId = Accounts.findUserByEmail(cleanObj(obj["Email"]));
        if (userId) {
            var result = Meteor.users.update(userId, {
                $set: {
                    parents: user.parents,
                    bank: user.bank,
                    office: user.office,
                    other: user.other,
                    "contact.homePhone": user.contact.homePhone,
                    "contact.address.fullAddress": user.contact.address.fullAddress,
                    children: user.children,
                    guests: user.guests,
                    pets: user.pets,
                    bedrooms: user.bedrooms,
                }
            });
            console.log('existe', result)
        } else {
            userId = Accounts.createUser({
                email: cleanObj(obj["Email"])
            });

            user.roles = ['family'];
            Meteor.users.update(userId, {$set: user})
        }
        console.log(i, obj["Email"]);
        if (i == 10000) {
            break

        }
    }
};


const preferredGender = function (val) {
    if (!val){
        console.log('***************************************', 'no preferredGender');
        return undefined

    }
    switch (val.toLowerCase()) {
        case 'any':
            return 'either';
        case 'f':
            return 'female';
        case 'm':
            return 'male';
        default:
            console.log('***************************************', 'no preferredGender');
            return undefined

    }

};
const getGender = function (val) {
    if (!val)
        return undefined;
    switch (val.toLowerCase()) {
        case 'f':
            return 'female';
        case 'm':
            return 'male';
        default:
            console.log('***************************************', 'no geneder');
            return undefined

    }

};
const getfamilySubStatus = function (val) {
    if (!val)
        return undefined;
    return val.toLowerCase()
};
const getDate = function (val) {
    val = cleanObj(val);
    if (!val)
        return undefined;
    try {
        const m = moment(val, "D-MMM-YYYY").toDate();
        if (m == "Invalid Date") {
            return undefined
        } else {
            return m
        }
    } catch (e) {
        console.log('***************************************', 'no getDate');
        console.error(e);
        return undefined
    }
};
const getInteger = function (val) {
    val = cleanObj(val);
    if (!val) {
        return undefined
    }

    try {
        const i = parseInt(val);
        if (typeof i == "NaN") {
            console.log('typeof i == "NaN"', typeof i);
            return 0
        } else {
            return i
        }
    } catch (e) {
        console.error('integer', e);
        return 0
    }
};
var getFloat = function (val) {
    val = cleanObj(val);
    if (!val)
        return undefined;
    try {
        const i = parseFloat(val);
        if (typeof i == "NaN") {
            return 0
        } else {
            return i
        }
    } catch (e) {
        console.error('getFloat', e);
        return 0
    }
};
var cleanObj = function (obj) {
    if (!obj)
        return undefined;
    if (typeof obj == "string")
        return obj.replace(/\t/, "").trim();

    return obj
};
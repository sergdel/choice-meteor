/**
 * Created by cesar on 4/10/16.
 */
import {familySchema} from "../imports/api/family/family";
import {_} from "lodash";
import {moment} from 'meteor/momentjs:moment'
import {Families} from '/imports/api/family/family'
var Fiber = Npm.require('fibers');
import diff from 'recursive-diff'

WebApp.connectHandlers.use("/import", function (req, res, next) {


    var fs = require('fs');
    var parse; //= require('csv-parse');
    var i = 0;
    var csvData = [];
    let keys, rows = [], o = {};
    var fiber = Fiber.current;
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write('<style>pre {outline: 1px solid #ccc; padding: 0px; margin: 0px; }        .string { color: green; }    .number { color: darkorange; }    .boolean { color: blue; }    .null { color: magenta; }    .key { color: red; }    </style>')
    let response = HTTP.get('http://cesarramos.me/lastfamilies3.csv');
    if (response.statusCode == 200) {
        let data = response.content.replace(/\"/gi, '');
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
        let i
        const updateFamily = function (family, obj) {
            family = pruneEmpty(family)
            let cloned = _.cloneDeep(family)

            //console.log(cloned)
            //console.log('*******************************dataFamily***********************************',_.isEqual(family,cloned))
            const dataFamily = constructFamilyObj(obj)
            //console.log(dataFamily)
            //console.log('*******************************mergedFamily***********************************',_.isEqual(family,cloned))
            const cloneddataFamily = _.cloneDeep(dataFamily)
            const mergedFamily = _.defaultsDeep(cloneddataFamily, cloned)
            //console.log(mergedFamily)
            //console.log('***********************************family*******************************',_.isEqual(family,cloned))
            //console.log(family)
            //console.log('******************************************************************',_.isEqual(family,cloned))

            const differnces = diff.getDiff(family, mergedFamily)
            res.write('<div >')
            res.write('<pre style="width: 33%; float: left; border:1px solid #ff0000" >' + syntaxHighlight(family) + '</pre><pre style="width: 33%; float: left; border:1px solid #ffff00">' + syntaxHighlight(dataFamily) + '</pre><pre style="width: 33%; float: left; border:1px solid #ff00ff">' + syntaxHighlight(mergedFamily) + '</pre>')
            res.write('<pre style="float:left; width: 100%; border:10px solid #000000">' + syntaxHighlight(differnces) + '</pre><div class="clear: both;"></div>')
            res.write('</div>')

            Families.update(family._id, {$set: mergedFamily})

        }
        for (i = 0; i < rows.length; i++) {
            let email = rows[i]["Email"]
            if (email) {
                rows[i]["Email"] = rows[i]["Email"].trim()
                email = email.trim()

                const family = Meteor.users.findOne({"emails.address": {$regex: email, $options: 'gi'}})
                if (family) {

                    updateFamily(family, rows[i])
                    res.write('OLD ' + email + '<br>')
                    //0 if (i>5) break
                } else {
                    res.write('NEW ' + email + '<br>')
                    insertFamily(rows[i])
                }
            } else {
                res.write('*******************************no email ' + (i + 1) + ' ' + email + '<br>')
            }
        }

    }
    res.end('xx')
});

function pruneEmpty(obj) {
    return function prune(current) {
        _.forOwn(current, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isString(value) && _.isEmpty(value)) ||
                (_.isObject(value) && _.isEmpty(prune(value)))) {

                delete current[key];
            }
        });
        // remove any leftover undefined values from the delete
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);

        return current;

    }(_.cloneDeep(obj));  // Do not modify the original object, create a clone instead
}


const constructFamilyObj = function (rowCVS) {
    const obj = _.clone(rowCVS)
    var familyStatus;
    switch (cleanObj(obj["Status"]).toLowerCase()) {
        case "approved":
            familyStatus = 3;
            break;
        case "declined":
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
                blueCard: {
                    number: cleanObj(obj["Child " + j + " BC #"]),
                    expiryDate: getDate(obj["Child " + j + " BC Exp"]),
                    status: blueCardStatus(obj["Child " + j + " BC #"], obj["Child " + j + " BC Exp"])
                }
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
                blueCard: {
                    number: cleanObj(obj["Guest " + j + " BC #"]),
                    expiryDate: getDate(obj["Guest " + j + " BC Exp"]),
                    status: blueCardStatus(obj["Guest " + j + " BC #"], obj["Guest " + j + " BC Exp"])
                }
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

    const parents = []
    parents[0] = {
        firstName: cleanObj(obj["Mother's Name"]),
        surname: cleanObj(obj["Family Name"]),
        gender: "female",
        mobilePhone: cleanObj(obj["Mother's Mobile"]),
        blueCard: {
            number: cleanObj(obj["Mother BC #"]),
            expiryDate: getDate(obj["Mother BC Exp"]),
            status: blueCardStatus(obj["Mother BC #"], obj["Mother BC Exp"])
        },
        email: cleanObj(obj["Email"]),
    }
    if (cleanObj(obj["Father's Name"])) {
        parents.push({
            firstName: cleanObj(obj["Father's Name"]),
            surname: cleanObj(obj["Family Name"]),
            gender: "male",
            mobilePhone: cleanObj(obj["Father's Mobile"]),
            blueCard: {
                number: cleanObj(obj["Father BC #"]),
                expiryDate: getDate(obj["Father BC Exp"]),
                status: blueCardStatus(obj["Father BC #"], obj["Father BC Exp"])
            },
            email: cleanObj(obj["Email"]),
        })
    }
    var user = {
        parents: parents,
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
        notes:[{note: cleanObj(obj["Notes"])}],
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
            drive: (cleanObj(obj["Pick up & drop-off"])),
            indoorSmoking: (cleanObj(obj["Smoking ok inside?"]) == "Yes") ? true : false,
            dietaryNotes: cleanObj(obj["Dietary Notes"]),
            familyInterests: cleanObj(obj["Interests"]),
            contactDate: getDate(obj["First Contact (Date)"]),
        },
        office: {
            familyStatus,
            familySubStatus: getfamilySubStatus(obj["Substatus"]),
            familyScore: getFloat(obj["Family Score"]),
            homeScore: getFloat(obj["House Score"]),
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
    return user
}
const insertFamily = function (obj, res) {
    console.log(obj["Email"])
    const userId = Accounts.createUser({
        email: cleanObj(obj["Email"])
    });
    const dataFamily = constructFamilyObj(obj)
    dataFamily.office = dataFamily.office || {}
    dataFamily.office.familyStatus = 0
    dataFamily.roles = ['family']
    Families.update(userId, {$set: dataFamily})
}
const blueCardStatus = function (number, date) {
    let res = 'apply'
    if (!number || !date) res = 'apply'
    if (number && date instanceof Date && date > new Date()) res = 'approved'
    if (date instanceof Date && date < new Date()) res = 'expired'
    if (date instanceof Date && date < moment().add(3, 'months')) res = 'expiring'
    return res

}
const preferredGender = function (val) {
    if (!val) {
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
        let m1, m2
        if (val.indexOf('-') > 0) {
            if (val.length >= 9) {
                m2 = moment.utc(val, "DD-MMM-YYYY")
            }else{
                m2 = moment.utc(val, "DD-MMM-YY")
            }
            return m2.isValid() ? m2.toDate() : undefined
        }
        if (val.indexOf('/') > 0) {
            if (val.length >= 9) {
                m1 = moment.utc(val, "DD/MM/YYYY")
            } else {
                m1 = moment.utc(val, "D/MM/YYYY")
            }
            return m1.isValid() ? m1.toDate() : undefined
        }
        return undefined

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
        return obj.replace(/\t|\n|\r/, "").trim();

    return obj
};


function syntaxHighlight(obj) {

    let json = JSON.stringify(obj, undefined, 4);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

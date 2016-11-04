/**
 * Created by cesar on 26/10/16.
 */
//var Future = Npm.require('fibers/future');
//var exec = Npm.require('child_process').exec;
import lodash from 'lodash'
//import CSV from 'comma-separated-values'
//import fs from 'fs'
import {exportFields} from "../export-fields";

import json2csv from 'json2csv'
/*
 Meteor.methods({
 exportFamilies: function (query, order, columns) {
 this.unblock();
 if (!Roles.userIsInRole(this.userId, 'admin')) {
 throw new Meteor.Error(403, 'Access forbiden', 'Only admin can export data base')
 }

 var future = new Future();
 const file = Random.id(32)
 //const fields = "<<ents.1.gender,parents.1.mobilePhone,parents.1.blueCardNumber,parents.1.blueCardExpiryDate,parents.1.email,contact.homePhone,contact.address.fullAddress,contact.address.street,contact.address.suburb,contact.address.city,contact.address.zip,children.0.firstName,children.0.gender,children.0.dateOfBirth,children.0.nameOfSchool,children.0.blueCardNumber,children.0.blueCardExpiry,children.1.firstName,children.1.gender,children.1.dateOfBirth,children.1.nameOfSchool,children.1.blueCardNumber,children.1.blueCardExpiry,children.2.firstName,children.2.gender,children.2.dateOfBirth,children.2.nameOfSchool,children.2.blueCardNumber,children.2.blueCardExpiry,children.3.firstName,children.3.gender,children.3.dateOfBirth,children.3.nameOfSchool,children.3.blueCardNumber,children.3.blueCardExpiry,children.4.firstName,children.4.gender,children.4.dateOfBirth,children.4.nameOfSchool,children.4.blueCardNumber,children.4.blueCardExpiry,children.5.firstName,children.5.gender,children.5.dateOfBirth,children.5.nameOfSchool,children.5.blueCardNumber,children.5.blueCardExpiry,guests.0.firstName,guests.0.surname,guests.0.gender,guests.0.dateOfBirth,guests.0.blueCardNumber,guests.0.blueCardExpiry,guests.1.firstName,guests.1.surname,guests.1.gender,guests.1.dateOfBirth,guests.1.blueCardNumber,guests.1.blueCardExpiry,guests.3.firstName,guests.3.surname,guests.3.gender,guests.3.dateOfBirth,guests.3.blueCardNumber,guests.3.blueCardExpiry,pets.0.type,pets.0.status,pets.1.type,pets.1.status,pets.2.type,pets.2.status,pets.3.type,pets.3.status,pets.4.type,pets.4.status,pets.5.type,pets.5.status,pets.6.type,pets.6.status,pets.7.type,pets.7.status,bedrooms.0.numberOfBeds,bedrooms.1.numberOfBeds,bedrooms.2.numberOfBeds,bedrooms.3.numberOfBeds,bedrooms.4.numberOfBeds,bedrooms.5.numberOfBeds,bedrooms.6.numberOfBeds,bedrooms.7.numberOfBeds,bank.bankName,bank.accountName,bank.accountBSB,bank.accountNumber,other.preferredGender,other.wiFiInternet,other.schoolTransport,other.indoorSmoking,other.dietaryNotes,other.familyInterests,office.familyStatus,office.familySubStatus,office.familyScore,office.homeScore,office.familyScore,office.homeScore,numberOfBeds,parentsCount,childrenCount,bedroomsCount,petsCount,guestsCount"
 const fields=_.values(columns)
 var command = "mongoexport --port 3001 --host localhost --db meteor --collection users --type=csv --out ./assets/app/exported/" + file + ".csv --fields " + fields + "  --query '" + JSON.stringify(query) + "' --sort '" + JSON.stringify(order) + "'";
 exec(command, function (error, stdout, stderr) {
 if (error) {
 throw new Meteor.Error(500, error);
 }
 future.return(file);
 });
 return future.wait();


 }
 })


 WebApp.connectHandlers.use("/exported/", function (req, res, next) {
 console.log(req.url)
 res.setHeader('Content-disposition', 'attachment; filename=families.csv');
 res.setHeader('Content-Type', 'text/csv');
 const path="./assets/app/exported" + req.url + ".csv"
 const file = fs.readFileSync(path)
 res.end(file);
 fs.unlink(path)

 })
 */

Meteor.methods({
    exportFamilies: function (query, order, columns) {
            if (!Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error(403, 'Access forbidden', 'Only admin can export data base')
        }
        if (!columns)
            columns = exportFields;
        const families = Meteor.users.find(query, {sort: order});
        let csvArray = [];
        families.forEach((family)=> {
            const obj = {};
            for (let header in columns) {
                obj[header] = lodash.get(family, columns[header], undefined) || undefined
            }
            csvArray.push(obj)
        });
        const fields = [];
        for (let header in columns) {
            fields.push({
                label: header,
                value: columns[header], // data.path.to.something
                default: '',

            })
        }
        return json2csv({data: families.fetch(), fields: fields});
    }
});


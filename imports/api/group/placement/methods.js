/**
 * Created by cesar on 9/12/16.
 */
/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Groups} from '/imports/api/group/group'
import {Families} from '/imports/api/family/family'
import {EmailTemplates} from '/imports/api/email/templates'
import htmlToText from 'html-to-text'

Meteor.methods({
    groupUpdateStatus: function (groupId, familyId, template) {
        check(familyId, String)
        check(groupId, String)
        check(template, EmailTemplates.schema.autoformGroupUpdateStatus)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access deny', 'Only staff and admin can update family - group status')
        }
        console.log(groupId, familyId)
        Groups.confirm(groupId, familyId, this.userId)
        sendStatusUpdateGroup(familyId, groupId, template)
    }
})


const sendStatusUpdateGroup = function (familyId, groupId, template) {
    //Is only allowed call this method from server (group.confirm)
    const group = Groups.findOne(groupId)
    const family = Families.findOne(familyId)
    const email = family.emails[0].address
    const firstName = family.firstName ? family.firstName : family.parents && family.parents[0] && family.parents[0].firstName || ''
    const surname = family.surname ? family.surname : family.parents && family.parents[0] && family.parents[0].surname || ''

    const groupName = group.name
    const fromDate = moment(group.dates[0]).format('Do MMM YY')
    const toDate = moment(group.dates[1]).format('Do MMM YY')
    const location = group.location
    const confirmedSummary = createTable(familyId, 'confirmed')
    const appliedSummary = createTable(familyId, 'applied')
    const availableSummary = createTable(familyId, false)

    let subject = template.subject.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
    subject = subject.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
    subject = subject.replace(/<img id="GroupName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, groupName)
    subject = subject.replace(/<img id="FromDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, fromDate)
    subject = subject.replace(/<img id="ToDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, toDate)
    subject = subject.replace(/<img id="Location" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, location)

    subject = htmlToText.fromString(subject)
    console.log(subject)
    let body = template.body.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
    body = body.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
    body = body.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
    body = body.replace(/<img id="GroupName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, groupName)
    body = body.replace(/<img id="FromDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, fromDate)
    body = body.replace(/<img id="ToDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, toDate)
    body = body.replace(/<img id="Location" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, location)
    body = body.replace(/<img id="ConfirmedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, confirmedSummary)
    body = body.replace(/<img id="AppliedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, appliedSummary)
    body = body.replace(/<img id="AvailableSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, availableSummary)
    const text = htmlToText.fromString(body)

    const options = {
        to: email,
        from: `${template.fromName} <${template.from}>`,
        subject: subject,
        "parent1": family.parents && family.parents[0] && family.parents[0].firstName,
        "parent2": family.parents && family.parents[1] && family.parents[1].firstName,
        "surname": family.parents && family.parents[0] && family.parents[0].surname,
        "mobilePhone": family.parents && family.parents[0] && family.parents[0].mobilePhone,
        'city': family.contact && family.contact.address && family.contact.address.city,
        'suburb': family.contact && family.contact.address && family.contact.address.suburb,
        'campaign': "Group confirmation",
        "loggedAt": family.loggedAt,
        "userId": template._id,
        html: body,
        text,
        status: 'sent',
    };
    if (Meteor.isProduction) {
        Email.send(options);
    } else {
        options.to = 'c@imagenproactiva.com'
        Email.send(options);
        console.log('email send to me')
    }
}
const createTable = function (familyId, status) {
    let groups
    if (status) {
        groups = Groups.find({families: {$elemMatch: {familyId, status}}})
        console.log(status)
    } else {
        groups = Groups.find({"families.familyId": {$ne: familyId}})
        console.log('avalibles',groups.count())
    }

    let table = '<table style="width: 100%; border: 1px solid #fefefe; text-align: center">' +
        '<thead>' +
        '<tr style=" text-align: center">' +
        '<th>Id</th><th>Group Name</th><th>Nationality </th><th>From</th><th>To</th><th>Ages</th><th>City</th><th>Study Location</th><th>Payment</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>'
    groups.forEach((group) => {
        table += `<tr  style=" text-align: center"><td>${group.id}</td><td>${group.name}</td><td>${group.nationality}</td><td>${moment(group.dates[0]).format('Do MMM YY')}</td><td>${moment(group.dates[1]).format('Do MMM YY')}</td><td>${group.ages}</td><td>${group.city}</td><td>${group.location}</td><td> ${group.payments}</td></tr>`

    })
    table += '</tbody>'
    return table
}
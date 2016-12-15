/**
 * Created by cesar on 9/12/16.
 */
/**
 * Created by cesar on 5/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {check, Match} from 'meteor/check'
import {Groups} from '/imports/api/group/group'
import {Families} from '/imports/api/family/family'
import {EmailTemplates} from '/imports/api/email/templates'
import htmlToText from 'html-to-text'

Meteor.methods({
    groupUpdateStatus: function (groupId, familyId, status, emailTemplate) {
        this.unblock()
        check(familyId, String)
        check(status, Match.OneOf('confirmed', 'canceled', 'applied'))
        check(groupId, String)
        check(emailTemplate, EmailTemplates.schema.autoformGroupUpdateStatus)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            throw new Meteor.Error(403, 'Access deny', 'Only staff and admin can update family - group status')
        }

        Groups.updateStatusTo(status, groupId, familyId, this.userId)
        sendStatusUpdateGroup(familyId, groupId, emailTemplate)
    },
    checkGroupConflict: function (groupId, familyId) {
        this.unblock()
        check(groupId, String)
        check(familyId, String)
        const family = Families.findOne(familyId)
        const group = Groups.findOne(groupId)
        const confirmedGroup = _.pluck(_.where(family.groups || [], {status: 'confirmed'}), 'groupId')

        const conflict=Groups.find({
            _id: {$in: confirmedGroup},
            $or: [
                {"dates.0": {$gte: group.dates[0], $lte: group.dates[1]}},
                {"dates.1": {$gte: group.dates[0], $lte: group.dates[1]}},
                {"dates.0": {$lte: group.dates[0]}, "dates.1": {$gte: group.dates[1]}},
            ]
        })

        return conflict.fetch()
    }
})


        const sendStatusUpdateGroup = function (familyId, groupId, emailTemplate) {
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

            let subject = emailTemplate.subject.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
            subject = subject.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
            subject = subject.replace(/<img id="GroupName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, groupName)
            subject = subject.replace(/<img id="FromDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, fromDate)
            subject = subject.replace(/<img id="ToDate" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, toDate)
            subject = subject.replace(/<img id="Location" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, location)

            subject = htmlToText.fromString(subject)

            let body = emailTemplate.body.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
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
                from: `${emailTemplate.fromName} <${emailTemplate.from}>`,
                subject: subject,
                "parent1": family.parents && family.parents[0] && family.parents[0].firstName,
                "parent2": family.parents && family.parents[1] && family.parents[1].firstName,
                "surname": family.parents && family.parents[0] && family.parents[0].surname,
                "mobilePhone": family.parents && family.parents[0] && family.parents[0].mobilePhone,
                'city': family.contact && family.contact.address && family.contact.address.city,
                'suburb': family.contact && family.contact.address && family.contact.address.suburb,
                'campaign': "Group confirmation",
                "loggedAt": family.loggedAt,
                "userId": emailTemplate._id,
                html: body,
                text,
                status: 'sent',
            };
            if (Meteor.isProduction) {
                Email.send(options);
            } else {
                options.to = 'c@imagenproactiva.com'
                Email.send(options);

            }
        }
        const createTable = function (familyId, status) {
            let groups, table
            if (status) {
                if (status == 'confirmed') {
                    table = '<p>Here is a summary of all of your confirmed groups:</p><br>'
                }
                if (status == 'applied') {
                    table = '<p>Here is a summary of other groups that you\'re applying for at this time:</p><br>'
                }
                groups = Groups.find({families: {$elemMatch: {familyId, status}}}, {sort: {"dates.0": 1}})


            } else {
                table = '<p>Here is a summary of other available groups that you may want to apply for:</p><br>'
                groups = Groups.find({"families.familyId": {$ne: familyId}}, {sort: {"dates.0": 1}})

            }
            table += '<table style="width: 100%; border-collapse: collapse; border: 1px solid #e4e4e4; text-align: center">' +
                '<thead>' +
                '<tr>' +
                '<th >Id</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">Group Name</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">Nationality </th> <th style=" text-align: center; border: 1px solid #e4e4e4;">From</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">To</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">Ages</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">City</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">Study Location</th> <th style=" text-align: center; border: 1px solid #e4e4e4;">Payment</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>'
            groups.forEach((group) => {
                table += `<tr style=" text-align: center"> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.id}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.name}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.nationality}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${moment(group.dates[0]).format('Do MMM YY')}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${moment(group.dates[1]).format('Do MMM YY')}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.ages}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.city}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;">${group.location}</td> <td style=" text-align: center; border: 1px solid #e4e4e4;"> ${group.payments}</td></tr>`

            })
            table += '</tbody>' +
                '</table>'
            if (groups.count() == 0)
                return ''
            return table
        }
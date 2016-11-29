/**
 * Created by cesar on 18/11/16.
 */
import './reports.html'
import {reportsAutoTable} from '/imports/api/email/reports'

Template.emailsReports.helpers({
    reportsAutoTable:reportsAutoTable
});

Template.emailsReports.events({
    //add your events here
});

Template.emailsReports.onCreated(function () {
    //add your statement here
});

Template.emailsReports.onRendered(function () {
    $('#body').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget)
        const content = button.data('content')
        const modal = $(this)

        modal.find('.modal-body').html(content)
    })
});

Template.emailsReports.onDestroyed(function () {
    //add your statement here
});


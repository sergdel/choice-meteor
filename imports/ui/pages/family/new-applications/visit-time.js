/**
 * Created by cesar on 22/12/16.
 */
import {Template} from 'meteor/templating'
import './visit-time.html'
import {moment} from 'meteor/momentjs:moment'
Template.familyNeApplicationVisitTime.onCreated(function () {

})
Template.familyNeApplicationVisitTime.onRendered(function () {
    const familyId = this.data._id
    //const startDate=this.data && this.data.office && this.data.office.firstVisit && this.data.office.firstVisit.time
    //const startMoment=startDate instanceof Date ? moment(startDate).format('YYYY-MM-DDThh:mm') : undefined
    $date = this.$('input')
    $date.daterangepicker({
        //startDate:  startMoment,
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: false,
        timePickerIncrement: 5,
        linkedCalendars: false,
        autoUpdateInput: false,
        // minDate: new Date(),
        locale: {
            format: 'DD/MM/YYYY'
        },
    }, function (start, end, label) {
    });
    $date.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DDThh:mm'));
        Meteor.call('updateFamilyFirstVisitTime', familyId, picker.startDate.toDate())
    });

    $date.on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

})

Template.familyNeApplicationVisitTime.helpers({
    value: function () {
        const instance = Template.instance()
        return instance.data && instance.data.office && instance.data.office.firstVisit && instance.data.office.firstVisit.time instanceof Date && moment(instance.data.office.firstVisit.time).format('YYYY-MM-DDThh:mm')
    }
})
Template.familyNeApplicationVisitTime.events({
    'apply.daterangepicker input'(e, instance){
    },
    'cancel.daterangepicker input'(e, instance){
    },
})
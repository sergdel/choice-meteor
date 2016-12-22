import {Template} from 'meteor/templating'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import './visit-staff.html'
Template.familyNeApplicationVisitStaff.onCreated(function () {

})


Template.familyNeApplicationVisitStaff.helpers({
    staff:Meteor.users.find({roles: 'staff'}),
    selected: function () {
        const instance=Template.instance()
        const staffId= instance.data &&  instance.data.office &&  instance.data.office.firstVisit &&  instance.data.office.firstVisit.staffId
        return (staffId== this._id ) ?  'selected' : ''
    }
})

Template.familyNeApplicationVisitStaff.events({
    'change select': function (e,instance) {
        Meteor.call('updateFamilyFirstVisitStaff',this._id,$(e.currentTarget).val())
    },
})
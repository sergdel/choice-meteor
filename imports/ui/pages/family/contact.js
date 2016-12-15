import './contact.html'
import {Families} from '/imports/api/family/family'
Template.familyContact.onCreated(function () {

});

Template.familyContact.onRendered(function () {
    $('[data-toggle="popover"]').popover()

});

Template.familyContact.onDestroyed(function () {
    //add your statement here
});

Template.familyContact.helpers({})

Template.familyContact.events({
    'click .contactInfo'(e, instance){
        const $button = $(e.currentTarget)
        const options = {
            placement: "left",
            html: true,
            trigger: 'hover',
            title: "Contact Information",
        }

        //this.userId || this._id ==>if is called from emailes reports use userId if if called from other else use _id
        const familyId = this.userId || this._id
        console.log(this.userId, this._id,familyId)
        if (!$button.data('created'))
            $button.html('<i class="fa fa-spinner fa-spin fa-fw"></i>')
            instance.subscribe('familyContactInfo', familyId, {
                onReady: function () {
                    $button.html('<i class="fa fa-phone"></i>')
                    const family = Families.findOne(familyId)
                    console.log('familyu',family)
                    const emails = _.pluck(family.emails, 'address').join(';')
                    const info = {
                        emails,
                        mobile: family.parents && family.parents[0] && family.parents[0].mobilePhone,
                        phone: family.contact && family.contact && family.contact.homePhone,
                    }
                    // $button.popover('destroy')
                    options.content = `<b>Emails: </b>${info.emails}<br>            <b>Mobile: </b>${info.mobile}<br>        <b>Phone: </b>${info.phone}`
                    $button.popover(options).popover('show')
                }
            })
        $button.data('created', true)
    }
});
import './contact.html'
import {Families} from '/imports/api/family/family'
Template.familyContact.onCreated(function () {

});

Template.familyContact.onRendered(function () {
    $('[data-toggle="popover"]').popover()
     $(document).on('click', event => {
            event.preventDefault();
            if (!$(event.target).closest(".contactInfo").length  && !$(event.target).closest(".popover").length) {
                    if($(".popover").length){
                          $(".popover").popover('hide')
                          event.stopImmediatePropagation()
                    }
            }
        });
});

Template.familyContact.onDestroyed(function () {
    //add your statement here
});

Template.familyContact.helpers({
    exists:()=>{
        const data=Template.instance().data
        if (ActiveRoute.name('familyList') &&  data._id) return true
        if (ActiveRoute.name('email') &&  data.userId) return true
        if (ActiveRoute.name('groupPlacements') &&  data._id) return true
        return false
    }
})

Template.familyContact.events({
    'click .contactInfo'(e, instance){
        if($(".popover").length)
                $(".popover").popover('hide');
        const $button = $(e.currentTarget)
        const options = {
            placement: "left",
            html: true,
            trigger: 'manual',
            title: "Contact Information",
        }
        //this.userId || this._id ==>if is called from emailes reports use userId if if called from other else use _id
        const familyId = this.userId || this._id
        if (!$button.data('created'))
            $button.html('<i class="fa fa-spinner fa-spin fa-fw"></i>')
            instance.subscribe('familyContactInfo', familyId, {
                onReady: function () {
                    $button.html('<i class="fa fa-phone"></i>')
                    const family = Families.findOne(familyId)
                    if (family && family.emails){
                        const emails = _.pluck(family.emails, 'address').join(';')
                        const info = {
                            emails,
                            mobile: family.parents && family.parents[0] && family.parents[0].mobilePhone,
                            phone: family.contact && family.contact && family.contact.homePhone,
                        }
                        // $button.popover('destroy')
                        options.content = `<b>Emails: </b>${info.emails}<br>            <b>Mobile: </b>${info.mobile}<br>        <b>Phone: </b>${info.phone}`
                    }else{
                        options.content = `This users doen't have contact information`
                    }

                    $button.popover(options).popover('show')
                }
            })
        $button.data('created', true)
    }
});
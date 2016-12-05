import {AutoForm} from 'meteor/aldeed:autoform'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {Template} from 'meteor/templating'
import './contact.html'
const contactSchema = new SimpleSchema({
    name: {
        type: String,
        optional: true,
        autoform: {
            placeholder: 'Your name',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    email: {
        type: String,
        autoform: {
            placeholder: 'Your email address',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    phone: {
        type: String,
        optional: true,
        autoform: {
            firstOption: '-- Please select --',
            placeholder: 'Your phone number',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    suburb: {
        type: String,
        optional: true,
        autoform: {
            firstOption: '-- Please select --',
            placeholder: 'Your suburb',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    school: {
        label: "School Drop-off & Pick-up",
        type: String,
        optional: true,
        autoform: {
            options: [
                {label: 'Yes - I can drive students to and from a nearby school', value: 'yes'},
                {label: 'No - I can\'t drive students to and from a nearby school', value: 'no'},
            ],
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    availability: {
        type: String,
        optional: true,
        autoform: {
            options: [
                {label: 'Yes - I am available to host students in January 2017', value: 'yes'},
                {label: 'No - I am not available to host students in January 2017', value: 'no'},
            ],
            afFormGroup: {
                "formgroup-class": 'col-sm-6',
            }
        }
    },
    message: {
        type: String,
        optional: true,
        autoform: {
            placeholder: 'Your Message or Enquiry',
            rows: 6,
            afFormGroup: {
                "formgroup-class": 'col-sm-12',
            }
        }
    },
    copy: {
        label: 'Also send a copy of this message to my email address',
        type: Boolean,
        defaultValue: false,
        autoform: {
            afFormGroup: {
                "formgroup-class": 'col-sm-12',
            }
        }

    }
})

AutoForm.addHooks('contactForm', {
    onSuccess: function (formType, result) {

        Meteor.setTimeout(() => {
            const $success = $('.successContact').slideDown()
            console.log('$success', $success)
            Meteor.setTimeout(() => {
                console.log('$success', $success)
                $success.slideUp()
            }, 6000)

        }, 200)
        return false
    },
    onSubmit: function (doc) {
        this.done(null, doc);
        return false
    },
})
Template.contact.helpers({
    contactSchema: contactSchema,
    doc: function () {
        const user = Meteor.user()
        if (Roles.userIsInRole(Meteor.userId(), ['family'])) {
            return {
                email: user.emails[0].address,
                phone: user.parents[0].mobilePhone,
            }
        }
    },
    type: function () {
        if (!ActiveRoute.name('home') && this.name != 'message' && this.name != 'copy') {
            return 'hidden'
        }
    },
});

Template.contact.events({
    //add your events here
});

Template.contact.onCreated(function () {
    //add your statement here
});

Template.contact.onRendered(function () {
    //add your statement here
});

Template.contact.onDestroyed(function () {
    //add your statement here
});


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
        const $success = $('.success').slideDown()
        Meteor.setTimeout(() => {
            $success.slideUp()
        }, 7000)
    },
})
Template.contact.helpers({
    contactSchema: contactSchema
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


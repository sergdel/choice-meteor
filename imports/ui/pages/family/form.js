import "/imports/api/family/family";
import "/imports/ui/componets/accordion";
import "/imports/ui/componets/button-submit"

import "./form.html";
import {Template} from "meteor/templating";
import {familySchema} from "/imports/api/family/family";
import "/imports/api/files/files";
import {moment} from 'meteor/momentjs:moment'


Template.familyForm.helpers({
    isOver175: (name, formId) => {
        const bod = AutoForm.getFieldValue(name, formId)
        if (bod instanceof Date) {
            return bod <= moment().subtract(17.5, 'years')
        }
        return false
    },
    schema: familySchema,
    new: () => Template.instance().data.formType == "method",
    edit: () => Template.instance().data.formType == "method-update",
    familyStatusOptions: () => Template.instance().data.familyStatusOptions,
    omitFields: () => {

        if (Roles.userIsInRole(Meteor.userId(), ['staff', 'admin'])) {
            return []
        } else {
            return ['parents.$.blueCard.notes', 'parents.$.blueCard.status', 'parents.$.blueCard.registered', 'children.$.blueCard.status', 'children.$.blueCard.registered', 'guests.$.blueCard.status', 'guests.$.blueCard.registered']
        }
    }

});

Template.familyForm.events({
    'change [name="office.tags"]'(){
    }
});

Template.familyForm.onCreated(function () {
    $('[name="office.tags"]').change((e, o) => {
        console.log('data-select2-tag', e, o, this)
    })
    this.autorun(() => {
        if (Roles.userIsInRole(Meteor.userId(), ['admin', 'staff'])) {
            this.subscribe('tags')
        }
    })
});

Template.familyForm.onRendered(function () {
    //add your statement here
});

Template.familyForm.onDestroyed(function () {
    //add your statement here
});

AutoForm.addHooks('familyForm', {
    onError: function (formType, error) {
        const errors = familySchema.namedContext("familyForm").invalidKeys()

        for (let i in errors) {
            const $field = $('[name="' + errors[i].name + '"]')
            const $panel = $field.parents('.panel-collapse')
            if (i == 0) {
                $panel.one('shown.bs.collapse', function () {
                    var body = $("html, body");
                    body.stop().animate({scrollTop: $field.offset().top - 30}, 600, 'swing');

                })
            }
            $panel.collapse('show')
        }
    },
});
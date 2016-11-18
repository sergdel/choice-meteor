/**
 * Created by cesar on 13/10/16.
 */
import {AutoForm} from 'meteor/aldeed:autoform'
import {beginSubmit,endSubmit} from '/imports/api/utilities'
AutoForm.addHooks(null,
    {
        beginSubmit: function (a, b) {
            beginSubmit.call(this)
        },

        onError: function (formType, error) {
            endSubmit.call(this)
        },
        endSubmit: function () {
            endSubmit.call(this)
        },
    }
);
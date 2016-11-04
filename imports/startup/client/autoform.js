/**
 * Created by cesar on 13/10/16.
 */
import {AutoForm} from 'meteor/aldeed:autoform'
import {beginSubmit,endSubmit} from '/imports/api/utilities'
AutoForm.addHooks(null,
    {
        beginSubmit: function (a, b) {
            console.log('beginSubmit', this);
            beginSubmit.call(this)
        },

        onError: function (formType, error) {
            console.log('onError', this);
            endSubmit.call(this)
        },
        endSubmit: function () {
            console.log('endSubmit', this);
            endSubmit.call(this)
        },
    }
);
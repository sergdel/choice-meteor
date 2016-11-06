import './readonly.html'
import {AutoForm} from 'meteor/aldeed:autoform'
AutoForm.addInputType("readonly", {
    template: "afInputReadOnly",
    contextAdjust: function (context) {
        AutoForm.Utility.addClass(context.atts, "form-control-static")

        return context;
    },
    valueOut:function () {
    }
});

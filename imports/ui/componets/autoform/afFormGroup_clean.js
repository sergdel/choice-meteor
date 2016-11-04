import './afFormGroup_clean.html'
import {Template} from "meteor/templating"
import {AutoForm} from "meteor/aldeed:autoform"
Template.afFormGroup_clean.onRendered(function () {


});
Template.afFormGroup_clean.helpers({
    skipLabel: function bsFormGroupSkipLabel() {
        var self = this;

        var type = AutoForm.getInputType(self.afFieldInputAtts);
        return (self.skipLabel || type === "boolean-checkbox");
    },
    bsFieldLabelAtts: function bsFieldLabelAtts() {
        var atts = _.clone(this.afFieldLabelAtts);
        // Add bootstrap class
        atts = AutoForm.Utility.addClass(atts, "control-label");
        return atts;
    },

});

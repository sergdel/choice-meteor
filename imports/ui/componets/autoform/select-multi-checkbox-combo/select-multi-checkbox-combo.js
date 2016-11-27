import './select-multi-checkbox-combo.css'
import './select-multi-checkbox-combo.html'
AutoForm.addInputType("select-multi-checkbox-combo", {
    template: "afSelectMultiCheckboxCombo",
    valueConverters: {
        "numberArray": function (val) {
            if (typeof val === "string") {
                val = val.split(",");
                return _.map(val, function (item) {
                    item = $.trim(item);
                    return AutoForm.valueConverters.stringToNumber(item);
                });
            }
            if (Array.isArray(val)) {
                return _.map(val, function (item) {
                    item = $.trim(item);
                    return AutoForm.valueConverters.stringToNumber(item);
                });
            }
            return val;
        },
    },
    valueOut: function () {

        var val = [];
        this.find('input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                val.push($(this).val());
            }
        });
        return val;
    },
    contextAdjust: function (context) {
        var itemAtts = _.omit(context.atts);
        // build items list
        context.items = [];
        // Add all defined options
        _.each(context.selectOptions, function (opt) {
            context.items.push({
                name: context.name,
                label: opt.label,
                value: opt.value,
                // _id must be included because it is a special property that
                // #each uses to track unique list items when adding and removing them
                // See https://github.com/meteor/meteor/issues/2174
                _id: opt.value,
                selected: (_.contains(context.value, opt.value)),
                atts: itemAtts
            });
        });

        return context;
    }
});
Template.afSelectMultiCheckboxCombo.events({});
Template.afSelectMultiCheckboxCombo.helpers({
    label: function () {
        return AutoForm.getFormSchema().schema(this.name).label
    },
    selected: function () {
        console.log('Template.afSelectMultiCheckboxCombo.helpers selected',this.value)
        return !!( Array.isArray(this.value) && this.value.length > 0)
    },
    atts: function selectedAttsAdjust() {
        var atts = _.clone(this.atts);
        delete atts.class;

        if (this.selected) {
            atts.checked = "";
        }
        // remove data-schema-key attribute because we put it
        // on the entire group
        delete atts["data-schema-key"];
        return atts;
    },
    dsk: function dsk() {
        return {
            "data-schema-key": this.atts["data-schema-key"]
        }
    }
});

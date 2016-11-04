import './select-checkbox-create-option.css'
import './select-checkbox-create-option.html'
AutoForm.addInputType("select-checkbox-create-option", {
    template: "afCheckboxCreateOption",
    valueIsArray: true,
    valueOut: function () {

        var val = [];
        this.find('input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                val.push($(this).val());
            }
        });
        this.find('input[type="text"]').each(function () {
            if ($(this).val()) {
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
Template.afCheckboxCreateOption.events({
    'click .addAnother'(e, instance){
        let atts;
        delete instance.data.atts["data-schema-key"];
        for (let key in instance.data.atts) {
            atts += ` ${key}="${instance.data.atts[key]}" `
        }
        $(".addAnother").before(`<div class="row checkbox-create-option">
              <div class="col-lg-4 col-md-5 col-sm-6">
                <div class="input-group">
                    <input type="text" class="form-control"  ${atts}>
                    <span class="input-group-btn">
                        <button class="btn btn-danger remove" type="button"><i class="fa fa-trash"></i></button>
                    </span>
                </div>
              </div>`)
    },
    'click .remove'(e, instance){
        $(e.currentTarget).parents('.row').remove()
    }
});
Template.afCheckboxCreateOption.helpers({
    atts: function selectedAttsAdjust() {
        var atts = _.clone(this.atts);
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

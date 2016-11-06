import {DateRangePicker} from './bootstrap-daterangepicker/daterangepicker'
import './autoform-bs-date-range-picker.html'


AutoForm.addInputType('bs-date-range-picker', {
    template: 'afBSDateRangePicker',
    valueOut: function () {
        return this.val()

    },
    valueIn: function (val) {
        console.log('valuein', val)
        return val
    },
    contextAdjust: function (ctx) {
        ctx.schema = AutoForm.getSchemaForField(ctx.name)
        return ctx
    },
    valueConverters: {
        "date": function (val) {
            console.log('valueConverters date', val)
            const daterangepicker = this.data('daterangepicker');
            if (typeof val === "string" && val.length > 0) {
                return new moment.utc(val, daterangepicker.locale.format).toDate()
            }
            return val;
        },
        "dateArray": function (val) {
            console.log('dateArray this val', this, val)
            const daterangepicker = this.data('daterangepicker');
            if (typeof val === "string") {
                val = val.split("-");
                return _.map(val, function (item) {
                    item = $.trim(item);
                    if (item.length > 0) {
                        return moment.utc(item, daterangepicker.locale.format).toDate();
                    } else {
                        return item
                    }
                });
            }
            return val;
        }

    },

});

Template.afBSDateRangePicker.helpers({
    atts: function addFormControlAtts() {
        var atts = _.clone(this.atts);
        atts = AutoForm.Utility.addClass(atts, "form-control");
        delete atts.rangeDatePickerOptions;
        return atts;
    }
});
Template.afBSDateRangePicker.onRendered(function () {
    console.log('Template.afBSDateRangePicker.onRendered', this)
    var $input = this.$('input');
    var options = this.data.atts.rangeDatePickerOptions;
    const value = this.data.value
    let startDate = options.startDate, endDate = options.endDate
    if (value) {
        if (typeof value == "array", value.length == 2) {
            startDate = value[0]
            endDate = value[1]
        }
        if (typeof value == "string") {
            startDate = value
        }
        options = _.extend(options, {
            startDate,
            endDate
        })

    }
    const optional=this.data.schema.optional
    console.log('schema',this.data.schema)
    if (optional) {
        options = _.extend(options, {
            autoUpdateInput: false,
        })
    }
    $input.daterangepicker(options);
    if (optional) {
        $input.on('apply.daterangepicker', function (ev, picker) {
            const format = picker.locale.format;
            $(this).val(picker.startDate.format(format) + ' - ' + picker.endDate.format(format));
            $input.trigger('change')
        });
    }
});

Template.afBSDateRangePicker.onDestroyed(function () {
    console.log('Template.afBSDateRangePicker.onDestroyed')
    //var $input = this.$('input');
    //$input.daterangepicker('remove');
});


/*

 /*$("[name^='daterangepicker_']").change(()=>{
 console.log('apply.daterangepicker',$input.data('daterangepicker'))
 $input.trigger('apply.daterangepicker',$input.data('daterangepicker'))
 })*/

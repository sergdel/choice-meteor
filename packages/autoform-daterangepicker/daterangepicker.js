import'./bootstrap-daterangepicker/daterangepicker.css'
import './daterangepicker.html'
import DateRangePicker from './bootstrap-daterangepicker/daterangepicker'
import {AutoForm} from 'meteor/aldeed:autoform'
import {moment} from 'meteor/momentjs:moment'


const stringToArray = function (val, format) {
    if (Array.isArray(val)) {
        return val
    }
    if (typeof val === "string") {
        val = val.split("-");
        return _.map(val, function (item) {
            item = $.trim(item);
            if (item.length > 0) {
                return moment.utc(item, format).toDate();
            } else {
                return item
            }
        });
    }
    return []
}
const arrayToString = function (val, format) {
    if (Array.isArray(val) && val.length == 2) {
        return moment.utc(val[0]).format(format) + ' - ' + moment(val[1]).format(format)
    }
    if (Array.isArray(val) && val.length == 1) {
        return moment.utc(val[0]).format(format)
    }
    if (val instanceof Date) {
        return moment.utc(val).format(format)
    }
    return val + ''
}
AutoForm.addInputType('daterangepicker', {
    template: 'afBSDateRangePicker',
    valueOut: function () {
        return this.val()
    },
    contextAdjust: function (ctx) {
        ctx.schema = AutoForm.getSchemaForField(ctx.name)
        return ctx
    },
    valueIn: function (val, obj) {
        console.log('daterangepicker valueIn', val, obj)

        const field = AutoForm.getSchemaForField(obj.name).autoform
        const format = field.dateRangePickerOptions && field.dateRangePickerOptions.locale && field.dateRangePickerOptions.locale.format || new DateRangePicker().locale.format
        return arrayToString(val, format)
    },
    valueConverters: {
        "date": function (val) {
            console.log("daterangepicker date", val)
            const daterangepicker = this.data('daterangepicker');
            if (typeof val === "string" && val.length > 0) {
                return new moment.utc(val, daterangepicker.locale.format).toDate()
            }
            return val;
        },
        "dateArray": function (val) {
            console.log("daterangepicker dateArray", val)
            const daterangepicker = this.data('daterangepicker');
            console.log('function', daterangepicker)
            return stringToArray(val, daterangepicker.locale.format)
        }

    },

});

Template.afBSDateRangePicker.helpers({
    atts: function addFormControlAtts() {
        var atts = _.clone(this.atts);
        atts = AutoForm.Utility.addClass(atts, "form-control");
        delete atts.dateRangePickerOptions;
        return atts;
    }
});
Template.afBSDateRangePicker.onRendered(function () {
    var $input = this.$('input');
    var options = this.data.atts.dateRangePickerOptions || {};
    const format = options.locale && options.locale.format || new DateRangePicker().locale.format
    const val = this.data.value
    let startDate = options.startDate, endDate = options.endDate
    if (val) {
        if (Array.isArray(val), val.length == 2) {
            startDate = val[0]
            endDate = val[1]
        }
        if (typeof val == "string") {
            startDate = val
        }
        options = _.extend(options, {
            startDate,
            endDate
        })
    }
    options = _.extend(options, {
        autoUpdateInput: false,
    })
    $input.daterangepicker(options);
    $input.on('apply.daterangepicker', function (ev, picker) {
        const format = picker.locale.format;
        if (options.singleDatePicker) {
            $(this).val(picker.startDate.format(format));
        } else {
            $(this).val(picker.startDate.format(format) + ' - ' + picker.endDate.format(format));
            $input.trigger('change')
        }
        $input.trigger('change')
    });
    $input.on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
});

Template.afBSDateRangePicker.onDestroyed(function () {
    //var $input = this.$('input');
    //$input.daterangepicker('remove');
});


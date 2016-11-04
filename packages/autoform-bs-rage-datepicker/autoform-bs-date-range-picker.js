import {DateRangePicker} from './bootstrap-daterangepicker/daterangepicker'
import './autoform-bs-date-range-picker.html'


AutoForm.addInputType('bs-date-range-picker', {
    template: 'afBSDateRangePicker',
    valueOut: function () {
        let val = this.val();
        let daterangepicker = this.data('daterangepicker');
        if (!daterangepicker) {
            return ''
        }
        if (daterangepicker.singleDatePicker) {
            const date = moment(val, daterangepicker.locale.format);
            if (date.isValid())
                return date;
            else
                return ''
        } else {
            val = val.split(' - ');
            const date0 = moment(val[0], daterangepicker.locale.format);
            const date1 = moment(val[1], daterangepicker.locale.format);
            if (date1.isValid() && date0.isValid())
                return [date0.toDate(), date1.toDate()];
            else
                return ''
        }
    }
});

Template.afBSDateRangePicker.helpers({
    atts: function addFormControlAtts() {
        var atts = _.clone(this.atts);
        atts = AutoForm.Utility.addClass(atts, "form-control");
        delete atts.rangeDatePickerOptions;
        return atts;
    },
    rangeDatePickerValue: function () {
        console.log('-->', this);
        return this.atts.rangeDatePickerValue
    }
});
Template.afBSDateRangePicker.onRendered(function () {

    var $input = this.$('input');
    console.log('input', $input);
    var options = this.data.atts.rangeDatePickerOptions;
    $input.daterangepicker(options);
    $input.on('apply.daterangepicker', function(ev, picker) {
        const format=picker.locale.format;
        $(this).val(picker.startDate.format(format) + ' - ' + picker.endDate.format(format));
        $input.trigger('change')
    });
    /*$("[name^='daterangepicker_']").change(()=>{
        console.log('apply.daterangepicker',$input.data('daterangepicker'))
        $input.trigger('apply.daterangepicker',$input.data('daterangepicker'))
    })*/

});

Template.afBSDateRangePicker.onDestroyed(function () {
    var $input = this.$('input');
    $input.daterangepicker('remove');
});




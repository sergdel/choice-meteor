autoform-daterangepicker
====================
[daterangepicker](https://github.com/dangrossman/bootstrap-daterangepicker/) packaged for [Meteor](http://meteor.com).
inspired and forked from https://github.com/antalakas/autoform-bs-daterangepicker/

### Installation

With Meteor 1.4.x and above, install using:

```sh
$ meteor add cesarve:autoform-daterangepicker
```


### Usage
a example for date range 
```js
SearchSchema = new SimpleSchema({
  searchRange: {
    type: [Date],
    label: "From - To",
    minCount: 2,
    maxCount: 2,
    optional: false,
    autoform: {
      type: "daterangepicker",
      dateRangePickerOptions: {
        dateLimit: { days: 6 },
        minDate: moment().add(-150, 'days'),
        maxDate:moment().add(6, 'months'),
        timePicker: false,
        locale: {
              format:  'DD/MM/YYYY',
            },
        timePickerIncrement: 30,
        timePicker12Hour: false,
        timePickerSeconds: false
      }
    }
  }
})
```
a example for single date 
```js
SearchSchema = new SimpleSchema({
    searchRange: {
      type: Date,
      label: "From - To",
      minCount: 2,
      maxCount: 2,
      optional: false,
      autoform: {
        type: "daterangepicker",
        dateRangePickerOptions: {
          singleDatePicker: true,
          locale: {
                format:  'DD/MM/YYYY',
              },
        }
      }
    },
})

```

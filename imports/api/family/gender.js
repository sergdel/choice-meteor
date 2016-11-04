/**
 * Created by cesar on 26/9/16.
 */
export const genderType = {
    optional: true,
    type: String,
    allowedValues: ['female', 'male'],
    autoform: {
        options: 'allowed',
        capitalize: true,
        afFieldInput:{
            class: 'form-control'
        },
        afFormGroup: {
            "formgroup-class": 'col-sm-3',
        }
    }
};

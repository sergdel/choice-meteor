/**
 * Created by cesar on 2/10/16.
 */
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
export const emailTemplateSchema = new SimpleSchema({
    body: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    height: 250,
                }// summernote options goes here
            },
        }
    }
});


AutoForm.addHooks('emailTemplateSchema', {
    onSubmit: function (doc) {
        this.done();
        return false;
    },
    onSuccess(t, r){
    }
}, false);

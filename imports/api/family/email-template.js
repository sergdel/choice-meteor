/**
 * Created by cesar on 2/10/16.
 */
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
export const emailTemplateSchema = new SimpleSchema({
    body: {
        type: String,
        autoform: {
            rows: 8
        }
    }
});


AutoForm.addHooks('emailTemplateSchema', {
    onSubmit: function (doc) {
        console.log('onSubmit AutoForm.hooks  emailTemplateSchema', doc);
        this.done();
        return false;
    },
    onSuccess(t,r){
        console.log('onSuccessonSuccessonSuccessonSuccessonSuccessonSuccessonSuccess',t,r)
    }
},false);

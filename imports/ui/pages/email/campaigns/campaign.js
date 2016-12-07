/**
 * Created by cesar on 18/11/16.
 */
import './campign.html'
import './search-form'
import {Template} from 'meteor/templating'
import {campaignSchema} from '/imports/api/email/campaign'


Template.emailsCampaign.helpers({
    campaignSchema: campaignSchema,

})

AutoForm.addHooks('campaignForm', {
    before: {
        method: function (doc) {
            BootstrapModalPrompt.prompt({
                title: "Confirm",
                content: 'Are you sure to send this campaign?',
                btnDismissText: 'Cancel',
                btnOkText: 'Send it'
            }, (data) => {
                if (data) {
                    this.result(doc)
                }
                else {
                    this.result(false);
                }
            });

            // Then return it or pass it to this.result()
            //return doc; (synchronous)
            //return false; (synchronous, cancel)
            //this.result(doc); (asynchronous)
            //this.result(false); (asynchronous, cancel)
        }
    },
    after: {
        method: function (error, result) {

        }
    },
    onSuccess: function (formType, result) {
        console.log('onSuccess')
    },

})

/**
 * Created by cesar on 18/11/16.
 */
import './campign.html'
import './search-form'
import {Template} from 'meteor/templating'
import {campaignSchema} from '/imports/api/email/campaign'

Template.emailsCampaign.onCreated(function () {
    this.subscribe('EmailTemplates')
})
Template.emailsCampaign.helpers({
    campaignSchema: campaignSchema,

})

AutoForm.addHooks('campaignForm', {
    before: {
        method: function (doc) {
            const customQuery = Session.get('campaignList_customQuery')
            doc.query=doc.query || {}
            if (!_.isEmpty(customQuery)){
                doc.query=_.extend(doc.query,customQuery)
            }
            Meteor.call('sendCampaignCount',doc,function(err,count){
                $('.calculating').replaceWith(count)
            })
            BootstrapModalPrompt.prompt({
                title: "Confirm",
                content: 'Are you sure to send this campaign to <i class="calculating fa-spinner fa-spinner fa-fw"></i>?',
                btnDismissText: 'Cancel',
                btnOkText: 'Send it'
            }, (data) => {
                if (data) {
                    doc.query=doc.query || {}

                    if (!_.isEmpty(customQuery)){
                        doc.query=_.extend(doc.query,customQuery)
                    }
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
    },

})

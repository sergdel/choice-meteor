/**
 * Created by cesar on 18/11/16.
 */
import './campign.html'
import './search-form'
import {Template} from 'meteor/templating'
import {campaignSchema} from '/imports/api/email/campaign'
import {Match} from 'meteor/check'

Template.emailsCampaign.onCreated(function () {
    this.subscribe('EmailTemplates')
    this.subscribe('groups')
})
Template.emailsCampaign.helpers({
    campaignSchema: campaignSchema,

})

AutoForm.addHooks('campaignForm', {
   before: {
        method: function (doc) {
            if (!Match.test(doc, this.ss))   return doc
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
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log('onSubmit',insertDoc, updateDoc, currentDoc)
        // You must call this.done()!
        this.done(); // submitted successfully, call onSuccess
        //this.done(new Error('foo')); // failed to submit, call onError with the provided error
        //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
    },
    after: {
        method: function (error, result) {
            console.log('after',error, result)
        }
    },
    onSuccess: function (formType, result) {
        console.log('onSuccess',formType,result)
    },

})

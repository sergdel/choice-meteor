/**
 * Created by cesar on 18/11/16.
 */
import './campign.html'
import {Template} from 'meteor/templating'
import {campaignSchema} from '/imports/api/email/campaign'



Template.emailsCampaign.helpers({
    campaignSchema:campaignSchema
})
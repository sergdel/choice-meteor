import './public.html'
/**
 * Created by cesar on 1/10/16.
 */
Template.public.helpers({
    logged:()=>{
        return !!Meteor.userId()
    }
});
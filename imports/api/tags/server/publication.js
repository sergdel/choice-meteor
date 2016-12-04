/**
 * Created by cesar on 29/11/16.
 */
import {Tags} from '/imports/api/tags/tags'
Meteor.publish('tags',function(){
    return Tags.findAll()
})
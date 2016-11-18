/**
 * Created by cesar on 18/11/16.
 */
import {Template} from 'meteor/templating'
import {ReactiveVar} from 'meteor/reactive-var'
import './tab.html'
Template.routableTabs.onCreated(function () {
    this.tabs=new ReactiveVar(this.data.tabs)
})
Template.routableTabs.helpers({
    tab: () => tabs,
    active(actualTab, index){
        let hash = window.location.hash.substr(1)
        const instance=Template.instance()
        const tabs=instance.tabs.get() || []
        console.log(tabs)
        for (tab of tabs) {
            if (actualTab.id == hash) {
                console.log(hash)
                return 'active'
            }else if  (tab.id == hash) {
                return ''
            }
        }
        console.log('index')
        if (index==0) return 'active'

    },

})

Template.routableTabs.events({
    'click a.routable'(e,instance){
        console.log(e,this.id)
        window.location.hash=this.id
    }
})
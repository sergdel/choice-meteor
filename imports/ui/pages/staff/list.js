import "./list.html"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {delay} from '/imports/api/utilities'
import {rowsByPage} from "/imports/api/globals";
Template.staffList.onCreated(function () {
    this.limit = new ReactiveVar(parseInt(FlowRouter.getParam("limit")) || rowsByPage);
    this.orderBy = new ReactiveVar({firstName: 1});
    this.query = new ReactiveVar({$or: [{roles: 'admin'}, {roles: 'staff'}]});
    this.autorun(()=>{
        this.subscribe('staffs', this.orderBy.get(), this.limit.get())
    })

});

Template.staffList.onRendered(function () {
     this.autorun(()=>{
        if (this.subscriptionsReady()){
            this.$('.hideWhenSubscriptionsReady').fadeOut()
        }
    })
});

Template.staffList.onDestroyed(function () {
    //add your statement here
});

Template.staffList.helpers({
    staff: ()=> {
        const instance = Template.instance();
        return Meteor.users.find(instance.query.get(), {
            sort: instance.orderBy.get(),
            limit: instance.limit.get()
        })
    },
    showMore: ()=> {
        const instance = Template.instance();
        return Meteor.users.find(instance.query.get(), {
                sort: instance.orderBy.get()
            }).count() === instance.limit.get()
    },
    nextLimit: ()=> {
        return Template.instance().limit.get() + rowsByPage
    },
    orderBy(orderBy)    {
        const orderByObj = Template.instance().orderBy.get();
        const orderByKey = Object.keys(orderByObj)[0];
        if (orderBy == orderByKey) {
            if (orderByObj[orderByKey] > 0) {
                return '<i class="fa fa-sort-asc"></i>'
            } else {
                return '<i class="fa fa-sort-desc"></i>'
            }
        }
    }
});

Template.staffList.events({
    'click .showMore'(e, instance){
        instance.limit.set(instance.limit.get() + rowsByPage)
    },
    'click .orderBy'(e, instance) {
        const oldOrderKey = Object.keys(instance.orderBy.get())[0];
        const newOrderKey = $(e.currentTarget).data('order');
        if (oldOrderKey == newOrderKey) {
            let newOrder = {};
            newOrder[newOrderKey] = instance.orderBy.get()[oldOrderKey] * -1;
            instance.orderBy.set(newOrder)
        } else {
            let newOrder = {};
            newOrder[newOrderKey] = $(e.currentTarget).data('direction');
            instance.orderBy.set(newOrder)
        }
    },
    'keyup input, change select, change input'(e, instance){
        delay(()=> {
            //** activate when families are more than 300 $(e.currentTarget).next('.hideWhenSubscriptionsReady').fadeIn()
            const search = $('[name="search"]').val();
            let query = instance.query.get();
            if (search) {
                query = _.extend(query, {
                    $or: [
                        {parents: {$elemMatch: {firstName: new RegExp(firstName, 'gi')}}},
                        {parents: {$elemMatch: {surname: new RegExp(firstName, 'gi')}}},
                        {emails: {$elemMatch: {address: new RegExp(email, 'gi')}}}
                    ]
                })
            }
            instance.query.set(query)
        })
    },
    'click .zoom'(e, instance)
    {
        FlowRouter.go('staffEdit', {staffId: this._id})
    }
})
;

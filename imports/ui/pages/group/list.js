import "./list.html"
import "./search-form"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {rowsByPage} from "/imports/api/globals";
import {getDistanceFromLatLonInKm} from "/imports/api/utilities";
//todo: ahref:flow-router-breadcrumb quitar


Template.groupList.onCreated(function () {
    this.limit = new ReactiveVar(parseInt(FlowRouter.getParam("limit")) || rowsByPage);
    Session.setDefaultPersistent('searchGroupListForm.orderBy', {createdAt: -1});
    this.query = new ReactiveVar({roles: "group"});
    this.autorun(()=> {
        let query = {roles: "group"};
        const address = Session.get('searchGroupListForm.address');
        if (address) {
            query = _.extend(query, {
                "contact.address.geometry": {
                    $near: {
                        $geometry: address.geometry,
                        $maxDistance: Session.get('searchGroupListForm.distance')
                    }
                }
            })
        }
        const adults = Session.get('searchGroupListForm.adults');
        if (Array.isArray(adults) && adults.length > 0) {

            query = _.extend(query, {
                "adult.status": {$in: adults}
            })
        }
        const keyWord = Session.get('searchGroupListForm.keyWord');
        if (keyWord) {
            const regex = {$regex: keyWord, $options: 'mi'};
            query = _.extend(query,
                {
                    $or: [
                        {"parents.firstName": regex},
                        {"parents.surname": regex},
                        {groupInterests: regex},
                        {"guest.firstName": regex},
                        {"guest.surname": regex},
                        {"children.firstName": regex},
                        {"emails.address": regex},
                        {"office.tags": regex},
                        {"parents.mobilePhone": regex},
                        {"contact.phoneHome": regex},
                        {"contact.address.fullAddress": regex},
                        {"contact.address.street": regex},
                        {"contact.address.suburb": regex},
                        {"contact.address.city": regex},
                        {"contact.address.state": regex},
                        {"contact.address.zip": regex},
                    ]
                })
        }
        const groupStatus = Session.get('searchGroupListForm.groupStatus');
        if (groupStatus) {
            query["office.groupStatus"] = groupStatus
        }
        console.log("query", query);
        this.query.set(query);
        Session.set('searchGroupListForm.query',query); //used for send query to server when ask for export cvs
        this.subscribe('families', this.limit.get(), query, Session.get('searchGroupListForm.orderBy'))
    })
});
Template.groupList.onRendered(function () {
    Session.setDefaultPersistent('searchGroupListForm.columnOrder', []);
    this.autorun(()=> {
        if (this.subscriptionsReady()) {
            Meteor.setTimeout(()=> {
                this.$('table.table-draggable').dragtable({
                    dragHandle: '.dragtable-drag-handle',
                    persistState: function (table) {
                        table.el.find('th').each(function (i) {
                            if (this.id != '') {
                                table.sortOrder[this.id] = i;
                            }
                        });
                        Session.setPersistent('searchGroupListForm.columnOrder', table.sortOrder)
                    },
                    restoreState: Session.get('searchGroupListForm.columnOrder')
                });
            });

            //this.$('.hideWhenSubscriptionsReady').fadeOut()
            //this.$('table').dragtable('order', Session.get('searchGroupListForm.columnOrder'))
        }

    })

});

Template.groupList.onDestroyed(function () {
    //add your statement here
});


Template.groupList.helpers({
    hasAddress: function () {
        const query = Template.instance().query.get();
        return _.isObject(query) && query.hasOwnProperty("contact.address.geometry")
    },
    group: ()=> {
        const instance = Template.instance();
        const query = {roles: "group"};
        console.log('group-------->', query);
        return Meteor.users.find(query, {
            sort: Session.get('searchGroupListForm.orderBy'),
            limit: instance.limit.get(),
            transform: (doc)=> {
                try {
                    const query = instance.query.get();
                    if (_.isObject(query) && query.hasOwnProperty("contact.address.geometry")) {
                        const pointA = query["contact.address.geometry"].$near.$geometry.coordinates;
                        const pointB = doc.contact.address.geometry.coordinates;
                        doc.distance = getDistanceFromLatLonInKm(pointA[0], pointA[1], pointB[0], pointB[1])
                    }
                } catch (e) {

                }
                return doc
            }
        })
    },
    showing: ()=> {
        return Template.instance().limit.get()
    },
    total: function () {
        return  Counts.get('familiesCounter')
    },
    showMoreLink: function () {
        const instance = Template.instance();

        if (Meteor.users.find(instance.query.get(), {
                sort: Session.get('searchGroupListForm.orderBy')
            }).count() < Counts.get('familiesCounter')) {
            const routeName = FlowRouter.current().route.name;
            const nextLimit = Template.instance().limit.get() + rowsByPage;
            return FlowRouter.path(routeName, {limit: nextLimit})
        }
        return false

    },

    orderBy(orderBy)    {

        const orderByObj = Session.get('searchGroupListForm.orderBy');
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

Template.groupList.events({
    'click .showMore'(e, instance){
        instance.limit.set(instance.limit.get() + rowsByPage)
    },
    'click .orderBy'(e, instance) {
        $('input[name="address"]').val('').change();
        const oldOrderKey = Object.keys(Session.get('searchGroupListForm.orderBy'))[0];
        const newOrderKey = $(e.currentTarget).data('order');
        if (oldOrderKey == newOrderKey) {
            let newOrder = {};
            newOrder[newOrderKey] = Session.get('searchGroupListForm.orderBy')[oldOrderKey] * -1;
            Session.setPersistent('searchGroupListForm.orderBy', newOrder)
        } else {
            let newOrder = {};
            newOrder[newOrderKey] = $(e.currentTarget).data('direction');
            Session.setPersistent('searchGroupListForm.orderBy', newOrder)
        }
    },
    'click .zoom'(e, instance){
        console.log(e);
        FlowRouter.go('groupEdit', {groupId: this._id})
    },

});


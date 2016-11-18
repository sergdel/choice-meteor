import "./list.html"
import "./search-form"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {rowsByPage} from "/imports/api/globals";
import {getDistanceFromLatLonInKm} from "/imports/api/utilities";
//todo: ahref:flow-router-breadcrumb quitar


Template.familyList.onCreated(function () {
    this.limit = new ReactiveVar();
    this.autorun(()=>{
        this.limit.set(parseInt(FlowRouter.getParam("limit") || rowsByPage))
    })
    Session.setDefaultPersistent('searchFamilyListForm.orderBy', {createdAt: -1});
    this.query = new ReactiveVar({roles: "family"});
    this.autorun(()=> {
        let query = {roles: "family"};
        const address = Session.get('searchFamilyListForm.address');
        if (address) {
            query = _.extend(query, {
                "contact.address.geometry": {
                    $near: {
                        $geometry: address.geometry,
                        $maxDistance: Session.get('searchFamilyListForm.distance')
                    }
                }
            })
        }
        const adults = Session.get('searchFamilyListForm.adults');
        if (Array.isArray(adults) && adults.length > 0) {

            query = _.extend(query, {
                "adult.status": {$in: adults}
            })
        }
        const keyWord = Session.get('searchFamilyListForm.keyWord');
        if (keyWord) {
            const regex = {$regex: keyWord, $options: 'mi'};
            query = _.extend(query,
                {
                    $or: [
                        {"parents.firstName": regex},
                        {"parents.surname": regex},
                        {familyInterests: regex},
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
        const familyStatus = Session.get('searchFamilyListForm.familyStatus');
        if (familyStatus) {
            query["office.familyStatus"] = familyStatus
        }
        this.query.set(query);
        Session.set('searchFamilyListForm.query',query); //used for send query to server when ask for export cvs
        this.subscribe('families', this.limit.get(), query, Session.get('searchFamilyListForm.orderBy'))
    })
});
Template.familyList.onRendered(function () {
    Session.setDefaultPersistent('searchFamilyListForm.columnOrder', []);
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
                        Session.setPersistent('searchFamilyListForm.columnOrder', table.sortOrder)
                    },
                    restoreState: Session.get('searchFamilyListForm.columnOrder')
                });
            });

            //this.$('.hideWhenSubscriptionsReady').fadeOut()
            //this.$('table').dragtable('order', Session.get('searchFamilyListForm.columnOrder'))
        }

    })

});

Template.familyList.onDestroyed(function () {
    //add your statement here
});


Template.familyList.helpers({
    hasAddress: function () {
        const query = Template.instance().query.get();
        return _.isObject(query) && query.hasOwnProperty("contact.address.geometry")
    },
    family: ()=> {
        const instance = Template.instance();
        const query = {roles: "family"};
        return Meteor.users.find(query, {
            sort: Session.get('searchFamilyListForm.orderBy'),
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
                sort: Session.get('searchFamilyListForm.orderBy')
            }).count() < Counts.get('familiesCounter')) {
            const routeName = FlowRouter.current().route.name;
            const nextLimit = Template.instance().limit.get() + rowsByPage;
            return FlowRouter.path(routeName, {limit: nextLimit})
        }
        return false

    },

    orderBy(orderBy)    {

        const orderByObj = Session.get('searchFamilyListForm.orderBy');
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

Template.familyList.events({
    'click .copyToken'(e,instance){
        Meteor.call('createToken',this._userId,(err,token)=>{

        })
    },
    'click .orderBy'(e, instance) {
        $('input[name="address"]').val('').change();
        const oldOrderKey = Object.keys(Session.get('searchFamilyListForm.orderBy'))[0];
        const newOrderKey = $(e.currentTarget).data('order');
        if (oldOrderKey == newOrderKey) {
            let newOrder = {};
            newOrder[newOrderKey] = Session.get('searchFamilyListForm.orderBy')[oldOrderKey] * -1;
            Session.setPersistent('searchFamilyListForm.orderBy', newOrder)
        } else {
            let newOrder = {};
            newOrder[newOrderKey] = $(e.currentTarget).data('direction');
            Session.setPersistent('searchFamilyListForm.orderBy', newOrder)
        }
    },
    'click .zoom'(e, instance){
        FlowRouter.go('familyEdit', {familyId: this._id})
    },

});


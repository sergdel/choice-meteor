import "./list.html"
import "./search-form"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {rowsByPage} from "/imports/api/globals";
import {Groups} from "/imports/api/group/group"
import moment from 'moment'

Template.groupList.onCreated(function () {
    this.limit = new ReactiveVar(parseInt(FlowRouter.getParam("limit")) || rowsByPage);
    Session.setDefaultPersistent('searchGroupListForm.orderBy', {createdAt: -1});
    this.query = new ReactiveVar({});

    this.autorun(()=> {
        let query={}
        const status = Session.get('searchGroupListForm.status');
        if (Array.isArray(status) && adults.length > 0) {
            query = _.extend(query, {
                "status": {$in: status}
            })
        }
        const keyWord = Session.get('searchGroupListForm.keyWord');
        if (keyWord) {
            const regex = {$regex: keyWord, $options: 'mi'};
            query = _.extend(query,
                {
                    $or: [
                        {"id": regex},
                        {"name": regex},
                        {"nationality": regex},
                        {"city": regex},
                        {"location": regex},
                    ]
                })
        }
        const searchRange = Session.get('searchGroupListForm.searchRange');
        if (Array.isArray(searchRange) && searchRange.length == 2) {
            query = _.extend(query, {
                "timestamp": {$gte: searchRange[0], $lte: moment(searchRange[1]).endOf("day").toDate()}
            })
        }
        console.log("query", query);
        this.query.set(query);
        Session.set('searchGroupListForm.query', query); //used for send query to server when ask for export cvs
        this.subscribe('groups', this.limit.get(), query, Session.get('searchGroupListForm.orderBy'))
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
    group: ()=> {
        const instance = Template.instance();
        const query = instance.query.get()
        return Groups.find(query, {
            sort: Session.get('searchGroupListForm.orderBy'),
            limit: instance.limit.get(),
        })
    },
    showing: ()=> {
        return Template.instance().limit.get()
    },
    total: function () {
        return Counts.get('groupsCounter')
    },
    showMoreLink: function () {
        const instance = Template.instance();

        if (Groups.find(instance.query.get(), {
                sort: Session.get('searchGroupListForm.orderBy')
            }).count() < Counts.get('groupsCounter')) {
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
    'click .groupNew'(e, instance){
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        BootstrapModalPrompt.prompt({
            title: "New Group",
            autoform: {
                collection: Groups,
                schema: Groups.schemas.new,
                type: "method",
                "meteormethod": "groupNew",
                id: 'groupNew',
                buttonContent: false,
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                console.log(data)
                FlowRouter.go('groupEdit', {groupId: data})
            }
            else {
                console.log('cancel')
            }
        });
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


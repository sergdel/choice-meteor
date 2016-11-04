import "./list.html"
import "./search-form"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {rowsByPage} from "/imports/api/globals";
import {BlueCard} from "/imports/api/blue-card/blue-card";
import moment from 'moment'
Template.blueCardList.onCreated(function () {
    this.limit = new ReactiveVar(parseInt(FlowRouter.getParam("limit")) || rowsByPage);
    Session.setDefaultPersistent('searchBlueCardListForm.orderBy', {createdAt: -1});
    this.query = new ReactiveVar({});
    this.autorun(()=> {
        let query = {};
        const status = Session.get('searchBlueCardListForm.status');
        if (Array.isArray(status) && status.length > 0) {

            query = _.extend(query, {
                "status": {$in: status}
            })
        }
        const keyWord = Session.get('searchBlueCardListForm.keyWord');
        if (keyWord) {
            const regex = {$regex: keyWord, $options: 'mi'};
            query = _.extend(query,
                {
                    $or: [
                        {"firstName": regex},
                        {"surname": regex},
                        {"number": regex},
                    ]
                })
        }
        const searchRange = Session.get('searchBlueCardListForm.searchRange');
        if (Array.isArray(searchRange) && searchRange.length ==2) {

            query = _.extend(query, {
                "expiryDate": {$gte: searchRange[0], $lte: moment(searchRange[1]).endOf('day').toDate() },
            })
        }

        console.log("---->queryqueryqueryqueryquery", query);
        this.query.set(query);
        Session.set('searchBlueCardListForm.query',query); //used for send query to server when ask for export cvs
        this.subscribe('blueCards', this.limit.get(), query, Session.get('searchBlueCardListForm.orderBy'))
    })
});
Template.blueCardList.onRendered(function () {
    /*
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
                        Session.setPersistent('searchBlueCardListForm.columnOrder', table.sortOrder)
                    },
                    restoreState: Session.get('searchBlueCardListForm.columnOrder')
                });
            })

            //this.$('.hideWhenSubscriptionsReady').fadeOut()
            //this.$('table').dragtable('order', Session.get('searchBlueCardListForm.columnOrder'))
        }

    })
*/
});

Template.blueCardList.onDestroyed(function () {
    //add your statement here
});


Template.blueCardList.helpers({
    blueCard: ()=> {
        const instance = Template.instance();
        const query = instance.query.get();
        console.log('blueCard-------->', query);
        return BlueCard.find(query, {
            sort: Session.get('searchBlueCardListForm.orderBy'),
            limit: instance.limit.get(),
        })
    },
    showing: ()=> {
        return Template.instance().limit.get()
    },
    total: function () {
        return  Counts.get('blueCardsCounter')
    },
    showMoreLink: function () {
        const instance = Template.instance();
        if (BlueCard.find(instance.query.get(), {
                sort: Session.get('searchBlueCardListForm.orderBy')
            }).count() < Counts.get('blueCardsCounter')) {
            const routeName = FlowRouter.current().route.name;
            const nextLimit = Template.instance().limit.get() + rowsByPage;
            return FlowRouter.path(routeName, {limit: nextLimit})
        }
        return false

    },

    orderBy(orderBy)    {

        const orderByObj = Session.get('searchBlueCardListForm.orderBy');
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

Template.blueCardList.events({

    'click .orderBy'(e, instance) {
        $('input[name="address"]').val('').change();
        const oldOrderKey = Object.keys(Session.get('searchBlueCardListForm.orderBy'))[0];
        const newOrderKey = $(e.currentTarget).data('order');
        if (oldOrderKey == newOrderKey) {
            let newOrder = {};
            newOrder[newOrderKey] = Session.get('searchBlueCardListForm.orderBy')[oldOrderKey] * -1;
            Session.setPersistent('searchBlueCardListForm.orderBy', newOrder)
        } else {
            let newOrder = {};
            newOrder[newOrderKey] = $(e.currentTarget).data('direction');
            Session.setPersistent('searchBlueCardListForm.orderBy', newOrder)
        }
    },
    'click .zoom'(e, instance){
        FlowRouter.go('familyEdit', {familyId: this._id})
    },

});


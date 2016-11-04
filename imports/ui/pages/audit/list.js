import "./list.css"
import "./list.html"
import "./search-form"
import {ReactiveVar} from "meteor/reactive-var"
import {Template} from "meteor/templating"
import {rowsByPage} from "/imports/api/globals";
import {familySchema} from '/imports/api/family/family'
import moment from 'moment'
Template.auditList.onCreated(function () {

    this.limit = new ReactiveVar(parseInt(FlowRouter.getParam("limit")) || rowsByPage);
    Session.setDefaultPersistent('searchAuditListForm.orderBy', {timestamp: -1});
    let query = {};
    if (this.data.familyId) {
        query.docId = this.data.familyId
    }
    this.query = new ReactiveVar(query);
    this.autorun(()=> {
        const actions = Session.get('searchAuditListForm.actions');
        if (Array.isArray(actions) && actions.length > 0) {

            query = _.extend(query, {
                "action": {$in: actions}
            })
        }
        const roles = Session.get('searchAuditListForm.roles');
        if (Array.isArray(roles) && roles.length > 0) {

            query = _.extend(query, {
                "custom.roles": {$in: roles}
            })
        }

        const staff = Session.get('searchAuditListForm.staff');
        if (Array.isArray(staff) && staff.length > 0) {
            query = _.extend(query, {
                "userId": {$in: staff}
            })
        }

        const keyWord = Session.get('searchAuditListForm.keyWord');
        if (keyWord) {
            const regex = {$regex: keyWord, $options: 'mi'};
            query = _.extend(query,
                {
                    $or: [
                        {"custom.roles": regex},
                        {"custom.name": regex},
                    ]
                })
        }



        const searchRange = Session.get('searchAuditListForm.searchRange');
        if (Array.isArray(searchRange) && searchRange.length ==2) {

            query = _.extend(query, {
                "timestamp": {$gte: searchRange[0], $lte: moment(searchRange[1]).endOf("day").toDate() }
            })
        }
        console.log('query---->',query);

        this.query.set(query);
        this.subscribe('audits', this.limit.get(), query, Session.get('searchAuditListForm.orderBy'))
    })
});
Template.auditList.onRendered(function () {
});

Template.auditList.onDestroyed(function () {
});


Template.auditList.helpers({
    accessed: function () {
        return this.action == "findOne"
    },
    kind: function () {
        switch (this.kind) {
            case "N":
                return "added";
            case "D":
                return "deleted";
            case "E":
                return "edited";
            case "A":
                return "added"
        }
    },
    isKindArray: function () {
        return this.kind == "A"
    },

    showObject: function (val) {
        var print = function (o, maxLevel, level) {
            if (typeof level == "undefined") {
                level = 0;
            }
            if (typeof level == "undefined") {
                maxLevel = 0;
            }
            var str = '';
            var levelStr = '';
            for (var x = 0; x < level; x++) {
                levelStr += '    ';
            }

            if (maxLevel != 0 && level >= maxLevel) {
                str += levelStr + '...</br>';
                return str;
            }

            for (var p in o) {
                if (typeof o[p] == 'string') {
                    str += levelStr +
                        p + ': ' + o[p] + ' </br>';
                } else {
                    str += levelStr +
                        p + ': { </br>' + print(o[p], maxLevel, level + 1) + levelStr + '}</br>';
                }
            }
            return str;
        };
        return print(val)
    },
    label: function () {
        const path = _.map(this.path, (val)=> {
            if (Number.isInteger(val)) {
                val = "$"
            }
            return val
        });
        return familySchema.label(path.join("."))
    },
    showRoles: function () {
        if (_.indexOf(this.custom.roles, 'admin') >= 0) {
            return 'Admin'
        }
        if (_.indexOf(this.custom.roles, 'staff') >= 0) {
            return 'Staff'
        }
        return 'No role'
    },
    showAction: function () {
        switch (this.action) {
            case 'insert':
                return 'Created';
            case 'update':
                return 'Updated';

            case 'findOne':
                return 'Accessed'
        }
    },
    audits: ()=> {
        const instance = Template.instance();
        return AuditLog.find(instance.query.get(), {
            sort: Session.get('searchAuditListForm.orderBy'),
            limit: instance.limit.get(),

        })
    },
    showing: ()=> {
        return Template.instance().limit.get()
    },
    total: function () {
        return Counts.get('auditCounter')
    },
    showMoreLink: function () {
        const instance = Template.instance();

        if (AuditLog.find(instance.query.get(), {
                sort: Session.get('searchAuditListForm.orderBy')
            }).count() < Counts.get('auditCounter')) {
            const routeName = FlowRouter.current().route.name;
            const nextLimit = Template.instance().limit.get() + rowsByPage;
            return FlowRouter.path(routeName, {familyId: this.familyId, limit: nextLimit})
        }
        return false

    },
    orderBy(orderBy)    {
        const orderByObj = Session.get('searchAuditListForm.orderBy');
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

Template.auditList.events({
    'click .zoom'(e, instance){
        $(e.currentTarget).next().slideToggle()
    },
    'click .showMore'(e, instance){
        instance.limit.set(instance.limit.get() + rowsByPage)
    },
    'click .orderBy'(e, instance) {
        $('input[name="address"]').val('').change();
        const oldOrderKey = Object.keys(Session.get('searchAuditListForm.orderBy'))[0];
        const newOrderKey = $(e.currentTarget).data('order');
        if (oldOrderKey == newOrderKey) {
            let newOrder = {};
            newOrder[newOrderKey] = Session.get('searchAuditListForm.orderBy')[oldOrderKey] * -1;
            Session.setPersistent('searchAuditListForm.orderBy', newOrder)
        } else {
            let newOrder = {};
            newOrder[newOrderKey] = $(e.currentTarget).data('direction');
            Session.setPersistent('searchAuditListForm.orderBy', newOrder)
        }
    },
});


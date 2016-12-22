import "./list.html"
import "./visit-staff"
import "./visit-time"
import "../search-form.js"
import {Template} from "meteor/templating"
import {newFamiliesAutoTable} from "/imports/api/family/new-applications-auto-table";

import "/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo"

Template.familyNewApplicationsList.onCreated(function () {
    this.subscribe('groups')
    this.subscribe('staffs')
});


Template.familyNewApplicationsList.onDestroyed(function () {
    //add your statement here
});


Template.familyNewApplicationsList.helpers({
    autoTable: () => newFamiliesAutoTable,
    customQuery: function () {
        return () => {
            let customQuery = {}
            const address = Session.get('searchNewApplicationListForm.address')
            if (address) {
                customQuery = {
                    "contact.address.geometry": {
                        $near: {
                            $geometry: address.geometry,
                            $maxDistance: Session.get('searchNewApplicationListForm.distance')
                        }
                    }
                }
            }
            const queryContact = Session.get('searchNewApplicationListForm.queryContact')
            if (queryContact) {
                customQuery.$or = [
                    {"emails.address": {$regex: queryContact, $options: 'gi'}},
                    {"parents.email": {$regex: queryContact, $options: 'gi'}},
                    {"parents.mobilePhone": {$regex: queryContact, $options: 'gi'}},
                    {"emails.homePhone": {$regex: queryContact, $options: 'gi'}},
                ]
            }
            return customQuery
        }
    }
});



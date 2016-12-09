/**
 * Created by cesar on 6/12/16.
 */

import {Meteor} from 'meteor/meteor'
import {BlueCard} from "/imports/api/blue-card/blue-card";
import {check} from "meteor/check";
import {Families} from "/imports/api/family/family";


Meteor.methods({
    updateBlueCardsNote: function (blueCardId, notes) {
        check(blueCardId, String)
        check(notes, String)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update notes')

        Families.updateNotes(blueCardId,notes)
    },

})
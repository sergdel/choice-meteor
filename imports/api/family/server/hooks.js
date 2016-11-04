/**
 * Created by cesar on 17/10/16.
 */
import {Meteor} from 'meteor/meteor'
import {AuditLog} from 'meteor/zeroasterisk:auditlog'
import {BlueCard} from '/imports/api/blue-card/blue-card'
/**
 *
 *
 * "Add a ""Blue Cards"" column with these status options:

 1) Declined (if any house member's blue card status = Declined)
 2) Expired (if any house member's blue card status = Expired, & none = declined)
 3) Apply (if any house member's blue card status = Apply, & none = declined or expired)
 4) Applying (if any house member's blue card status = Applying, & none = declined, expired or apply)
 5) Approved (if any house member's blue card status = Approved, & none = declined, expired, apply or applying)
 6) "n/a" (if all house member are n/a)
 "


 */

export const calcBlueCardStatus = function (blueCards) {
    this.map = ["n/a","approved" ,"applying", "apply", "expired","declined" ];
    if (!Array.isArray(blueCards) || blueCards.length<=0)
        return 'n/a';
    blueCards = _.pluck(blueCards, 'status');
    blueCards=_.map(blueCards, (blu)=> {
        return _.indexOf(this.map, blu)
    });
    blueCards.sort();
    return this.map[blueCards.pop()]
};


Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {


    const familyId = doc._id;
    BlueCard.remove({familyId});
    const allMembers=[];
    const insertBlueCard = function (blus, type) {
        if (Array.isArray(blus))
            blus.forEach((blu)=> {
                const member= {
                    familyId,
                    firstName: blu.firstName,
                    surname: blu.surname,
                    dateOfBirth: blu.dateOfBirth,
                    number: blu.blueCard && blu.blueCard.number ? blu.blueCard.number : undefined,
                    expiryDate: blu.blueCard && blu.blueCard.expiryDate ? blu.blueCard.expiryDate : undefined,
                    status: blu.blueCard && blu.blueCard.status ? blu.blueCard.status : undefined,
                    type
                };
                allMembers.push(member);
                BlueCard.insert(member)
            })
    };
    insertBlueCard(doc.parents, 'parents');
    insertBlueCard(doc.children, 'children');
    insertBlueCard(doc.guests, 'guests');
    const blueCardStatus=calcBlueCardStatus(allMembers);
    if (!modifier.$set) modifier.$set = {};

    let numberOfBeds = 0;
    for (let i in doc.bedrooms) {
        numberOfBeds = numberOfBeds + doc.bedrooms[i].numberOfBeds
    }

    Meteor.users.direct.update(doc._id, {
        $set: {
            "office.score": ((doc.office && doc.office.familyScore ? doc.office.familyScore : 0) + (doc.office && doc.office.homeScore ? doc.office.homeScore : 0)) / 2,
            parentsCount: doc.parents ? doc.parents.length : 0,
            childrenCount: doc.children ? doc.children.length : 0,
            bedroomsCount: doc.bedrooms ? doc.bedrooms.length : 0,
            petsCount: doc.pets ? doc.pets.length : 0,
            guestsCount: doc.guests ? doc.guests.length : 0,
            numberOfBeds,
            blueCardStatus: blueCardStatus
        }
    });
    doc.children = _.map(doc.children, (val)=> {
        val.surname = doc.parents[0].surname;
        return val
    })


}, {fetchPrevious: false});


AuditLog.assignCallbacks(Meteor.users, {
    omit: ['createdAt', 'services', 'updatedAt', 'lastLogin'],
    auditFindOne: false,
    custom: function (userId, docId, collectionName, actionType, result) {
        const user = Meteor.users.direct.findOne(userId);
        if (!user) return {};
        const roles = user.roles;
        const name = user.firstName + ' ' + user.surname;
        return {
            roles,
            name
        }
    }
});


Meteor.startup(()=> {
    if (Meteor.isServer) {
        Meteor.users.update({}, {$set: {version: {number: 4, at: new Date()}}},{multi: true });
        /*
         const cursor = Meteor.users.find({
         roles: 'family',
         guestsCount: {$exists: 0},
         bedroomsCount: {$exists: 0},
         parentsCount: {$exists: 0},
         childrenCount: {$exists: 0}
         })
         cursor.forEach((doc)=> {
         doc.parentsCount = doc.parents ? doc.parents.length : 0
         doc.childrenCount = doc.children ? doc.children.length : 0
         let bedrooms = []
         for (let i in doc.bedrooms) {
         if (doc.bedrooms[i] && doc.bedrooms[i].numberOfBeds > 0) {
         bedrooms.push({numberOfBeds: doc.bedrooms[i].numberOfBeds})
         }
         }
         doc.bedrooms = bedrooms
         doc.bedroomsCount = doc.bedrooms ? doc.bedrooms.length : 0
         if (doc.bedroomsCount > 0)
         doc.bedsCount = _.reduce(doc.bedrooms, (mem, room)=> {
         return mem + room.numberOfBeds
         }, 0)
         else
         doc.bedsCount = 0
         doc.guestsCount = doc.guest ? doc.guest.length : 0
         Meteor.users.update(doc._id, doc)
         })
         */

    }
});

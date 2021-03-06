/**
 * Created by cesar on 14/12/16.
 */
import {Meteor} from 'meteor/meteor'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Families} from '/imports/api/family/family'
import {moment} from  'meteor/momentjs:moment'

const expireBlueCard = function () {
    const in3month = moment().add(3, 'months').toDate()
    const now = new Date()
    let expiring = 0
    let expired = 0
    let cursor
        let fed,fe

    cursor = BlueCard.find({expiryDate: {$lte: in3month}, status: {$ne: 'expiring'}})
    cursor.forEach((blu) => {
         fe=Meteor.users.update({
            _id: blu.familyId,
            [blu.type + '.blueCard.id']: blu._id
        }, {$set: {[blu.type + '.$.blueCard.status']: 'expiring'}})
    })
    expiring+=BlueCard.update({expiryDate: {$lte: in3month}, status: {$ne: 'expiring'}}, {$set: {status: 'expiring'}},{multi: true})
    cursor = BlueCard.find({expiryDate: {$lte: now}, status: {$ne: 'expired'}})
    cursor.forEach((blu) => {
        fed=Meteor.users.update({
            _id: blu.familyId,
            [blu.type + '.blueCard.id']: blu._id
        }, {$set: {[blu.type + '.$.blueCard.status']: 'expired'}})
    })
    expired+=BlueCard.update({expiryDate: {$lte: now}, status: {$ne: 'expired'}}, {$set: {status: 'expired'}},{multi: true})

}
Meteor.startup(() => {
    const h1 = Meteor.setInterval(() => {
        console.info('checking hour 0')
        const now = new Date()
        if (now.getHours() == 0) {
            console.info('************************************************* 24h expiring bluecards')
            Meteor.clearInterval(h1)
            Meteor.setInterval(expireBlueCard, 24 * 60 * 60 * 1000)
        }
    },1000*60*10) //ten minutes
})
















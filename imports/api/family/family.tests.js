/**
 * Created by cesar on 15/11/16.
 */
import {setBlueCardStatus} from './family'
import {setGeneralBlueCardStatus} from './family'
import {setArrayCount} from './family'
import {moment} from "meteor/momentjs:moment";
import {chai} from 'meteor/practicalmeteor:chai';


const family = {
    parents: [
        {blueCard: {status: 'n/a',}},
        {
            blueCard: {
                status: 'approved',
                number: 'xx',
                expiryDate: moment().subtract(1, 'days')
            }
        },
        {
            blueCard: {
                status: 'approved',
                number: 'xx',
                expiryDate: moment().add(2, 'days')
            }
        },
    ],
    children: [
        {
            birthOfDate: moment().subtract(17, 'years'),
            blueCard: {
                status: 'approved',
                expiryDate: moment().subtract(1, 'days')
            }
        },
        {
            birthOfDate: moment().subtract(17, 'years'),
            blueCard: {
                number: 'xx',
                status: 'approved',
                expiryDate: moment().subtract(1, 'days')
            }
        },
        {
            birthOfDate: moment().subtract(17, 'years'),
            blueCard: {
                number: 'xx',
            }
        },
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                status: 'approved',
                expiryDate: moment().subtract(1, 'days')
            }
        },
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                number: 'xxx',
                status: 'approved',
                expiryDate: moment().add(1, 'days')
            }
        },
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                number: 'xxx',
                status: 'approved',
                expiryDate: moment().subtract(1, 'days')
            }
        },
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                number: 'xxx',
                status: 'approved',
            }
        },
    ],
    guests: [
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                number: 'xx',
                status: 'excempt',
                expiryDate: moment().add(1, 'days')
            },

        },
        {
            birthOfDate: moment().subtract(19, 'years'),
            blueCard: {
                status: 'approved',
                expiryDate: moment().subtract(1, 'days')
            }
        },
    ],
    pets: [
        {
            "type": "Dog",
            "status": "Indoor"
        },

    ],
    bedrooms: [
        {
            "numberOfBeds": 1,
            "clothesStorage": false,
            "ensuite": false
        },
        {
            "numberOfBeds": 4,
            "clothesStorage": false,
            "ensuite": false
        }
    ],
}

describe('Hook family collection', function () {
    it('change each member status', function () {

        setBlueCardStatus(family)
        chai.assert.equal(family.parents[0].blueCard.status, 'apply');
        chai.assert.equal(family.parents[1].blueCard.status, 'expired');
        chai.assert.equal(family.parents[2].blueCard.status, 'approved');
        chai.assert.equal(family.children[0].blueCard.status, 'n/a');
        chai.assert.equal(family.children[1].blueCard.status, 'n/a');
        chai.assert.equal(family.children[2].blueCard.status, 'n/a');
        chai.assert.equal(family.children[3].blueCard.status, 'apply');
        chai.assert.equal(family.children[4].blueCard.status, 'approved');
        chai.assert.equal(family.children[5].blueCard.status, 'expired');
        chai.assert.equal(family.children[6].blueCard.status, 'expired');
        chai.assert.equal(family.guests[0].blueCard.status, 'excempt');
        chai.assert.equal(family.guests[1].blueCard.status, 'apply');
        chai.assert.equal(family.blueCardStatus, 'expired');
    })
    it('calc array counts ', function () {
        setArrayCount(family)
        chai.assert.equal(family.parentsCount, 3);
        chai.assert.equal(family.childrenCount, 7);
        chai.assert.equal(family.guestsCount, 2);
        chai.assert.equal(family.petsCount, 1);
        chai.assert.equal(family.bedroomsCount, 2);
        chai.assert.equal(family.numberOfBeds, 5);
        delete family.pets
        setArrayCount(family)
        chai.assert.equal(family.petsCount, 0);
    })
});

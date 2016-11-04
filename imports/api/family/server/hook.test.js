/**
 * Created by cesar on 2/11/16.
 */
import {calcBlueCardStatus} from './hooks'
import {chai} from 'meteor/practicalmeteor:chai';
describe('Hook family collection', function () {
    it('calc the status of a group of family members', function () {
        let data = [{"status": "n/a"}, {"status": "n/a"}, {"status": "apply"}, {"status": "expired"}, {"status": "expired"}];
        chai.assert.equal(calcBlueCardStatus(data), 'expired');
        data = [{"status": "n/a"}, {"status": "n/a"}, {"status": "n/a"}, {"status": "n/a"}, {"status": "n/a"}];
        chai.assert.equal(calcBlueCardStatus(data), 'n/a');
        data = [{"status": "n/a"}, {"status": "declined"}, {"status": "apply"}, {"status": "expired"}, {"status": "expired"}];
        chai.assert.equal(calcBlueCardStatus(data), 'declined');
        data = [{"status": "n/a"}, {"status": "n/a"}, {"status": "apply"}, {"status": "applying"}];
        chai.assert.equal(calcBlueCardStatus(data), 'apply');
        data = [{"status": "n/a"}, {"status": "n/a"}, {"status": "applying"}, {"status": "applying"}];
        chai.assert.equal(calcBlueCardStatus(data), 'applying')
    })
});
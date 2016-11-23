/**
 * Created by cesar on 9/11/16.
 */
import {Tracker} from 'meteor/tracker'
export class PersistentReactiveVar {
    constructor(id, initialValue) {
        this.id=id
        this.dep = new Tracker.Dependency;
        this.setDefault(initialValue)
        console.log('constructor id',initialValue)
        console.log('constructor initialValue',initialValue)
        console.log('constructor PersistentReactiveVar',amplify.store(this.id))
    }
    set(val) {
        this.dep.changed()
        this.val = val
        amplify.store(this.id,val)
       console.log(this.id,'set PersistentReactiveVar',amplify.store(this.id))

    }
    get() {
        this.dep.depend()
        //console.log(this.id,'get PersistentReactiveVar',amplify.store(this.id))
        return amplify.store(this.id);

    }
    setDefault(val) {
        if (amplify.store(this.id)===undefined && val !== undefined  ) {
            console.log(this.id,'setDefault***** PersistentReactiveVar amplify',amplify.store(this.id))
            console.log(this.id,'setDefault***** PersistentReactiveVar val',val )
            console.log(this.id,'setDefault***** PersistentReactiveVar indef',amplify.store(this.id), val  )
            this.set(val)
        }

    }
}


/**
 * Created by cesar on 29/11/16.
 */
import {Families} from '/imports/api/family/family'

class TagsClass extends Mongo.Collection {
    insert(tags) {
        if (Array.isArray(tags)) {
            for (let tag of tags) {
                if (super.find(tag).count() == 0) {
                    super.insert({_id: tag, count: 0})
                }
                const count=Families.find({"office.tags":tag}).count()
                super.update(tag, {$inc: {count}})
            }
        }
    }

    findAll() {
        return super.find({},{sort:{count: -1}})
    }

    options() {
        return super.find({},{sort:{count: -1}}).fetch().map((tag) => ({value: tag._id, label: `${tag._id}  (${tag.count})`}))
    }
}

export const Tags = new TagsClass('afTags')

Tags.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
})
Tags.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
})

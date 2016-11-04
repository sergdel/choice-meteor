/**
 * Created by cesar on 3/10/16.
 */

Meteor.publish('file', function (fileId) {
    console.log('file subs');
    return Files.collection.find(fileId);
});

Meteor.publish('files', function () {
    return Files.collection.find({});
});
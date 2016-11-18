/**
 * Created by cesar on 3/10/16.
 */

Meteor.publish('file', function (fileId) {
    return Files.collection.find(fileId);
});


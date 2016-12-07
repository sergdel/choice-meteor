import  '../files'
Meteor.publish('file', function (fileId) {
    return Files.collection.find(fileId);
});



// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by select-checkbox-create-option.js.
import { name as packageName } from "meteor/cesarve:select-checkbox-create-option";

// Write your tests here!
// Here is an example.
Tinytest.add('select-checkbox-create-option - example', function (test) {
  test.equal(packageName, "select-checkbox-create-option");
});

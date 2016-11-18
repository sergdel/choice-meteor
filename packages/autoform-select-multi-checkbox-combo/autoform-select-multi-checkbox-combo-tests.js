// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by autoform-select-multi-checkbox-combo.js.
import { name as packageName } from "meteor/cesarve:autoform-select-multi-checkbox-combo";

// Write your tests here!
// Here is an example.
Tinytest.add('autoform-select-multi-checkbox-combo - example', function (test) {
  test.equal(packageName, "autoform-select-multi-checkbox-combo");
});

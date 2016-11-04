/**
 * Created by cesar on 4/10/16.
 */
import {LoginToken} from "meteor/dispatch:login-token";
if (Meteor.isServer) LoginToken.setMaxUse(9999);
if (Meteor.isClient) LoginToken.autologin();
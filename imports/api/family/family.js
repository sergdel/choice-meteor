/**
 * Created by cesar on 26/9/16.
 */
import {childSchema} from "./children";
import {guestSchema} from "./guests";
import {parentSchema} from "./parents";
import {contactSchema} from "./contact";
import {petSchema} from "./pets";
import {bedroomSchema} from "./bedrooms";
import {bankSchema} from "./bank";
import {otherSchema} from "./others";
import {officeSchema} from "./office";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {adultSchema} from "./adult/adult";
export const familySchema = new SimpleSchema({
    createdAt: {
        optional: true,
        type: Date
    },
    parents: {
        type: [Object],

    },
    "parents.$": {
        type: parentSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    contact: {
        optional: true,
        type: contactSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }

    },
    children: {
        optional: true,
        type: [Object],

    },
    "children.$": {
        type: childSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },

    guests: {
        optional: true,
        type: [Object],

    },
    "guests.$": {
        type: guestSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    pets: {
        optional: true,
        type: [Object],

    },
    "pets.$": {
        type: petSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },

    bedrooms: {
        optional: true,
        type: [Object],

    },
    "bedrooms.$": {
        type: bedroomSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            }
        }
    },
    bank: {
        optional: true,
        type: bankSchema
    },

    other: {
        optional: true,
        type: otherSchema
    },

    office: {
        optional: true,
        type: officeSchema
    },
    adult: {
        optional: true,
        type: adultSchema,
        autoform: {
            atts: {
                template: "bootstrap3"
            },
            afFormGroup: {
                template: "bootstrap3",
                label: false
            }
        }
    },
    files: {
        label: "Files",
        type: [String],
        optional: true,

    },
    "files.$": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
            }
        }
    },
    notes: {
        type: [Object],
        optional: true,

    },
    "notes.$.note": {
        optional: true,
        type: String,
        autoform: {
            afFieldInput: {
               rows: 3
            },
            afFormGroup: {
                template: "bootstrap3",
            }
        }
    },
    "notes.$.date": {
        optional: true,
        type: Date,
        autoform: {
            readonly: true,
            afFieldInput: {
                type: "datetime-local",
                readonly: true
            },
            afFormGroup: {
                template: "bootstrap3",
            }
        },
        autoValue:function () {
            return new Date()
        }

    },

});




familySchema.messages({
    notUnique: "[label] already exist",
    required: "Please complete this field",
});


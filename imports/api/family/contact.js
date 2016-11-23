/**
 * Created by cesar on 26/9/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";


//todo quitar todos los iptional true eso solo fue con finaes de la improtacion
export const addressSchema = new SimpleSchema({
    fullAddress: {
        optional: true,
        type: String
    },
    lat: {

        optional: true,
        type: Number,
        decimal: true
    },
    lng: {
        optional: true,
        type: Number,
        decimal: true
    },
    geometry: {
        optional: true,
        type: Object,
        blackbox: true
    },
    placeId: {
        optional: true,
        type: String
    },
    street: {
        optional: true,
        type: String,
    },
    suburb: {
        optional: true,
        type: String,
    },
    city: {
        optional: true,
        type: String,
    },
    state: {
        optional: true,
        type: String,
    },
    zip: {
        optional: true,
        type: String,

    },
    country: {
        optional: true,
        type: String
    }
});
export const optsGoogleplace= {
    type: 'googleUI',
    optional: true,
    stopTimeoutOnKeyup: false,
    googleOptions: {
        componentRestrictions: {country: 'au'}
    }
};
export const addressType={
    type: addressSchema,
    optional: true,
    autoform: {
        type: 'googleplace',
        opts:optsGoogleplace
    }
};

export const contactSchema = new SimpleSchema({
    homePhone: {
        optional: true,
        type: String
    },
    address: addressType
});


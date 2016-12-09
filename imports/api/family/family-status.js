/**
 * Created by cesar on 1/10/16.
 */
export const familyStatus = [
    {
        id: 0,
        label: "New application",
        map: [0, 1, 2, 3, 4, 5],
    },
    {
        id: 1,
        label: "Ready to process",
        map: [1, 2, 3, 4, 5],
        emailTemlate: {
            id: "ReadyToProcess",
            type: "fixed"
        }
    },
    {
        id: 2,
        label: "Being processed",
        map: [2, 3, 4, 5],
        emailTemlate: {
            id: "BeingProcessed",
            type: "editable"
        }
    },
    {
        id: 3,
        label: "Approved",
        map: [3, 4, 5],
        emailTemlate: {
            id: "Approved",
            type: "editable"
        }
    },
    {
        id: 4,
        label: "Declined",
        map: [3, 4, 5],
        emailTemlate: {
            id: "Declined",
            type: "editable"
        }
    },
    {
        id: 5,
        label: "Suspended",
        map: [3, 4, 5],
        emailTemlate: {
            id: "Suspended",
            type: "editable"
        }
    }
];


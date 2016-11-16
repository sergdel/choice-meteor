/**
 * Created by cesar on 15/11/16.
 */
export const emailTemplateFixtures=[{
    "_id": "enrollAccount",
    "id": "Enroll Account",
    "subject": "An account has been created for you on  ChoiceHomeStay.com",
    "body": "<p>To start using the service simply click the link below.</p><p><br><img id=\"url\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAgCAYAAABkWOo9AAACkklEQVRYR+2Yv2taURTHv1f8QWIMxVENFgJZJLRjstUsjuYP0EWQEJA0IPhMlqZrsjxxEAcXhQi6ZMngIHYWwSo4ZWiKmCGEIGZ6z5BbziVK00T6Up72Bbzj43nu533OOffIZQCwv7//zmq1fmGMbQN4T88MsC4552eqqn6VZbnPHiFrjLGPBoB7hsA5/66qqp9JkiQD+GxEyN+YUgT6w0DpnuTrkkC5wW0KvDmo3lmaG33JqNVqRSQSgdlsRj6fx2Aw0Cz+VUZDoRDcbjeq1SoajcZ4EwLY2dnB/f09MpnMxM3pvcPDQ1gsFqRSKVxfX08HdG9vDy6XC51OB4VC4QmoFgACTSaTY9Cbm5vpgMZiMXg8HrTbbZyenj4B1QJgOFCqPbJvMplwdXUFn88nPur8/BxbW1vGMUqgBwcHWFhYEIDD4VDUL5UL1fmoRv976gmUSmFxcRF3d3c4OTmBqqowZOoJlIyWSiU0m01hdmagu7u78Hq9aLVaKBaLE5tpZPTPFM8MNBgMYnNzExcXF8jlcmNQp9OJeDyOh4cHpNNp9Pv9F4+hmYEGAgH4/X7RGNlsFt1uV8DStFlbW8Pt7S2Oj48npphAqcloMtGBP7Vmoo0SiQSWlpYEbK/Xg8PhABmlVavVUKlUBOhLQPRckiTY7fZnQ+NvJ/+rRigFW1lZQTgcxvLy8jg2pZwaplwuj5uGPshmsz0zF41Gsbq6KspElmXNY/TVoCO69fV1YZMWzX06frSujY0NAVqv17X+ZP7HWbMprS/+c+q1bqDXe3NQvUyO4rwdo4lE4pIx5tXbgJ7xOOc/386VDl2S2Wy2bwA+6GlBx1gtRVE+MQr4CHvEOd82ShmIdDN2pijKEV07/gKYC6HAJTlR2gAAAABJRU5ErkJggg==\"></p><p><br></p><p><br></p>",
    "buttons": {
        "FirstName": {
            "contents": "First name",
            "tooltip": "First Name",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
        },
        "surname": {
            "contents": "Surname",
            "tooltip": "Surname",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
        },
        "url": {
            "contents": "Url",
            "tooltip": "Url",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Url</div>"
        }
    },
    "from": "no-replay@choicehomestay.com",
    "fromName": "Choice Home Stay"
}, {
    "_id": "verifyEmail",
    "id": "Verify Email",
    "subject": "How to verify email address on ChoiceHomeStay.com",
    "body": "To verify your account email simply click the link below. <br><img id=\"url\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAgCAYAAABkWOo9AAACkklEQVRYR+2Yv2taURTHv1f8QWIMxVENFgJZJLRjstUsjuYP0EWQEJA0IPhMlqZrsjxxEAcXhQi6ZMngIHYWwSo4ZWiKmCGEIGZ6z5BbziVK00T6Up72Bbzj43nu533OOffIZQCwv7//zmq1fmGMbQN4T88MsC4552eqqn6VZbnPHiFrjLGPBoB7hsA5/66qqp9JkiQD+GxEyN+YUgT6w0DpnuTrkkC5wW0KvDmo3lmaG33JqNVqRSQSgdlsRj6fx2Aw0Cz+VUZDoRDcbjeq1SoajcZ4EwLY2dnB/f09MpnMxM3pvcPDQ1gsFqRSKVxfX08HdG9vDy6XC51OB4VC4QmoFgACTSaTY9Cbm5vpgMZiMXg8HrTbbZyenj4B1QJgOFCqPbJvMplwdXUFn88nPur8/BxbW1vGMUqgBwcHWFhYEIDD4VDUL5UL1fmoRv976gmUSmFxcRF3d3c4OTmBqqowZOoJlIyWSiU0m01hdmagu7u78Hq9aLVaKBaLE5tpZPTPFM8MNBgMYnNzExcXF8jlcmNQp9OJeDyOh4cHpNNp9Pv9F4+hmYEGAgH4/X7RGNlsFt1uV8DStFlbW8Pt7S2Oj48npphAqcloMtGBP7Vmoo0SiQSWlpYEbK/Xg8PhABmlVavVUKlUBOhLQPRckiTY7fZnQ+NvJ/+rRigFW1lZQTgcxvLy8jg2pZwaplwuj5uGPshmsz0zF41Gsbq6KspElmXNY/TVoCO69fV1YZMWzX06frSujY0NAVqv17X+ZP7HWbMprS/+c+q1bqDXe3NQvUyO4rwdo4lE4pIx5tXbgJ7xOOc/386VDl2S2Wy2bwA+6GlBx1gtRVE+MQr4CHvEOd82ShmIdDN2pijKEV07/gKYC6HAJTlR2gAAAABJRU5ErkJggg==\">",
    "buttons": {
        "FirstName": {
            "contents": "First name",
            "tooltip": "First Name",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
        },
        "surname": {
            "contents": "Surname",
            "tooltip": "Surname",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
        },
        "url": {
            "contents": "Url",
            "tooltip": "Url",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Url</div>"
        }
    },
    "from": "no-replay@choicehomestay.com",
    "fromName": "Choice Home Stay"
}, {
    "_id": "welcomeEmail",
    "id": "Registration email",
    "subject": "Welcome to ChoiceHomeStay",
    "body": "Welcome to ChoiceHomeStay",
    "buttons": {
        "FirstName": {
            "contents": "First name",
            "tooltip": "First Name",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
        },
        "surname": {
            "contents": "Surname",
            "tooltip": "Surname",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
        },

    },
    "from": "no-replay@choicehomestay.com",
    "fromName": "Choice Home Stay"
}, {
    "_id": "resetPassword",
    "id": "Reset Password",
    "subject": "How to reset your password on ChoiceHomeStay",
    "body": "To reset your password,  simply click the link below <br><img id=\"url\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAgCAYAAABkWOo9AAACkklEQVRYR+2Yv2taURTHv1f8QWIMxVENFgJZJLRjstUsjuYP0EWQEJA0IPhMlqZrsjxxEAcXhQi6ZMngIHYWwSo4ZWiKmCGEIGZ6z5BbziVK00T6Up72Bbzj43nu533OOffIZQCwv7//zmq1fmGMbQN4T88MsC4552eqqn6VZbnPHiFrjLGPBoB7hsA5/66qqp9JkiQD+GxEyN+YUgT6w0DpnuTrkkC5wW0KvDmo3lmaG33JqNVqRSQSgdlsRj6fx2Aw0Cz+VUZDoRDcbjeq1SoajcZ4EwLY2dnB/f09MpnMxM3pvcPDQ1gsFqRSKVxfX08HdG9vDy6XC51OB4VC4QmoFgACTSaTY9Cbm5vpgMZiMXg8HrTbbZyenj4B1QJgOFCqPbJvMplwdXUFn88nPur8/BxbW1vGMUqgBwcHWFhYEIDD4VDUL5UL1fmoRv976gmUSmFxcRF3d3c4OTmBqqowZOoJlIyWSiU0m01hdmagu7u78Hq9aLVaKBaLE5tpZPTPFM8MNBgMYnNzExcXF8jlcmNQp9OJeDyOh4cHpNNp9Pv9F4+hmYEGAgH4/X7RGNlsFt1uV8DStFlbW8Pt7S2Oj48npphAqcloMtGBP7Vmoo0SiQSWlpYEbK/Xg8PhABmlVavVUKlUBOhLQPRckiTY7fZnQ+NvJ/+rRigFW1lZQTgcxvLy8jg2pZwaplwuj5uGPshmsz0zF41Gsbq6KspElmXNY/TVoCO69fV1YZMWzX06frSujY0NAVqv17X+ZP7HWbMprS/+c+q1bqDXe3NQvUyO4rwdo4lE4pIx5tXbgJ7xOOc/386VDl2S2Wy2bwA+6GlBx1gtRVE+MQr4CHvEOd82ShmIdDN2pijKEV07/gKYC6HAJTlR2gAAAABJRU5ErkJggg==\">",
    "buttons": {
        "FirstName": {
            "contents": "First name",
            "tooltip": "First Name",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
        },
        "surname": {
            "contents": "Surname",
            "tooltip": "Surname",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
        },
        "url": {
            "contents": "Url",
            "tooltip": "Url",
            "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Url</div>"
        }
    },
    "from": "no-replay@choicehomestay.com",
    "fromName": "Choice Home Stay"
}]


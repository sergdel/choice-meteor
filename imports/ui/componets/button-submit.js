/**
 * Created by cesar on 12/11/16.
 */
import './button-submit.html'
Template.buttonSubmit.events({
    'click button'(e){
        const $button=$(e.currentTarget)
        let $form=$button.parent().find('form')
        $form.submit()


    }
})
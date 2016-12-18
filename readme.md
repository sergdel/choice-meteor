# Meteor version of ChoiceHomeStay.com

## Install

    git clone https://bitbucket.org/websightcreative/choice-meteor.git
    cd choice-meteor
    meteor npm install
    git submodule update --init --recursive
    meteor run
    
in other terminal
    
    cd private
    mongorestore db --db meteor --drop  --port 3001
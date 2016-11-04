import {FilesCollection} from "meteor/ostrio:files";
Files = new FilesCollection({
    collectionName: 'Files',
    allowClientCode: false, // Disallow remove files from Client,
    onBeforeUpload: function (file) {
        console.log('onBeforeUpload', file, file.size <= 10485760, /png|jpg|jpeg|pdf/i.test(file.ext));
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg|pdf/i.test(file.extension)) {
            console.log('return tru');
            return true;
        } else {
            console.log('return false');
            return 'Please upload image, with size equal or less than 5 Mb !';
        }
    }
});
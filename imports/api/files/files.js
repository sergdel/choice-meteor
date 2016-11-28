import {FilesCollection} from "meteor/ostrio:files";
Files = new FilesCollection({
    collectionName: 'Files',
    allowClientCode: false, // Disallow remove files from Client,
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg|pdf/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 5 Mb !';
        }
    }
});
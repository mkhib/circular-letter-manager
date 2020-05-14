function getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
}

const validateFile = function (filename) {
    let ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'bmp':
        case 'png':
        case 'jpeg':
        case 'tif':
        case 'tiff':
        case 'pdf':

            return true;
    }
    return false;
}

export default validateFile;
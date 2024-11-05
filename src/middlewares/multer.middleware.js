import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        let fileExtension = "";
        if(file.originalname.split('.').length > 1){
            fileExtension = file.originalname.split('.')[1];
        }

        const filenameExcludingExtension = file.originalname
        .toLowerCase()
        .split(' ')
        .join('-')
        ?.split('.')[0];

      const uniqueSuffix = Date.now() +
      Math.ceil(Math.random() * 1e5) + // avoid rare name conflict
      fileExtension
      cb(null, filenameExcludingExtension + uniqueSuffix)
    }
  })
  
export const upload = multer({ storage: storage ,
    limits: { fileSize: 1 * 1024 * 1024 },
})
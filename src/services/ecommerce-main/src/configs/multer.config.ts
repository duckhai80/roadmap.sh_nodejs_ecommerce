import multer from "multer";

const uploadMemory = multer({ storage: multer.memoryStorage() });
const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export { uploadDisk, uploadMemory };

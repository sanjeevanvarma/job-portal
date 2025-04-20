import multer from "multer";

const storage = multer.diskStorage({})

const upload = multer({storage})

export default upload

// import multer from "multer";
// import path from "path";

// // Configure storage options
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Define the 'uploads' directory where files will be saved
//         cb(null, 'uploads/');  // Ensure the 'uploads' folder exists or create it manually
//     },
//     filename: function (req, file, cb) {
//         // Save the file with a unique name (current timestamp + file extension)
//         cb(null, Date.now() + path.extname(file.originalname));  // Avoid file name conflicts
//     }
// });

// // Set up multer with the defined storage configuration
// const upload = multer({ storage });

// export default upload;

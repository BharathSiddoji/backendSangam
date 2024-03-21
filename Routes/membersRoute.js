const express = require("express");
const member_router = express.Router();
const Member = require("../Models/membershipModel");
const isAuthenticated = require("../Middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const ActiveMember = require("../Models/activeMember");
const bodyParser = require("body-parser");

const multer = require("multer");
const sharp = require("sharp");
const { check, validationResult } = require("express-validator");

member_router.use(bodyParser.urlencoded({ extended: false }));
member_router.use(cookieParser());
member_router.use(express.urlencoded({ extended: true }));
member_router.use(express.json());

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({
  limits: {
    fileSize: 5000000, // accepts only images with size up to 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image file (jpg, jpeg, or png)."), false);
    } else {
      cb(null, true);
    }
  },
});

// Validation rules for member creation
const memberCreationRules = [
  check("name").trim().notEmpty().withMessage("Name is required."),
  check("email").trim().isEmail().withMessage("Invalid email address."),
  check("phone").trim().notEmpty().withMessage("Phone number is required."),
  check("dob").trim().notEmpty().withMessage("Date of birth is required."),
  check("address").trim().notEmpty().withMessage("Address is required."),
  check("sonof").trim().notEmpty().withMessage("Father name is required."),
  check("gender").trim().notEmpty().withMessage("Gender is required."),
  check("address").trim().notEmpty().withMessage("Address is required."),
  check("state").trim().notEmpty().withMessage("State is required."),
  check("qualification")
    .trim()
    .notEmpty()
    .withMessage("Qualification is required."),
  check("tamil").trim().notEmpty().withMessage("Tamil is required."),
  check("maleMembers")
    .trim()
    .notEmpty()
    .withMessage("Male Members field is required."),
  check("femaleMembers")
    .trim()
    .notEmpty()
    .withMessage("Female Members field is required."),
  check("employmentStatus")
    .trim()
    .notEmpty()
    .withMessage("EmploymentStatus is required."),

  // Custom validation for email and phone uniqueness
  check("email").custom(async (email) => {
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      throw new Error("Email already exists.");
    }
    return true;
  }),
  check("phone").custom(async (phone) => {
    const existingMember = await Member.findOne({ phone });
    if (existingMember) {
      throw new Error("Phone number already exists.");
    }
    return true;
  }),

  // Custom validation for image presence
  check("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please upload an image.");
    }
    return true;
  }),
];

member_router.post("/member", upload.single("file"), async (req, res) => {
  console.log(req.body);

  const {
    name,
    email,
    sonof,
    dob,
    pob,
    gender,
    address,
    phone,
    state,
    qualification,
    tamil,
    employmentStatus,
    whatsapp,
    familyMembers,
    rws,
    intrested,
  } = req.body;
  const existingMember = await Member.findOne({ email });
  if (existingMember) {
   return res.status(409).json({ message: "There is an existing email" });
  }
  const buffer = await sharp(req.file.buffer).png({ quality: 100 }).toBuffer();

  // Create a new member in your database
  const newMember = await Member.create({
    name,
    email,
    sonof,
    dob,
    pob,
    gender,
    address,
    phone,
    state,
    qualification,
    tamil,
    familyMembers,
    employmentStatus,
    image: buffer,
    whatsAppNumber: whatsapp,
    rws,
    intrested,
  });
  res.json({ message: "success" });
});



// sending all the member application details
member_router.get("/member", isAuthenticated, async (req, res) => {
  const allMembers = await Member.find();
  res.status(200).json(allMembers);
});

//sending only the details of specific id
member_router.get("/member/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  const member = await Member.findOne({ _id: id });
  res.status(200).json(member);
});

//Deleting Member from the Application List
member_router.delete("/member/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const deleted = await Member.findOneAndDelete({ _id: id });
  // console.log(deleted)
  res.status(200).json({ message: "user deleted" });
});

//Approving Member to Join the Sangam
member_router.post(
  "/member/:id/activeMember",
  isAuthenticated,
  async (req, res) => {
    const { id } = req.params;
    const foundMember = await Member.findOne({ _id: id });
    console.log(foundMember);
    const foundMemberObj = foundMember.toObject();
    if (foundMember) {
      const checkExisting = await ActiveMember.findOne({
        phone: foundMemberObj.phone,
        email: foundMemberObj.email,
      });

      if (checkExisting) {
        // console.log("existing",checkExisting)
        return res
          .status(500)
          .json({
            message: "Member already exists in the Active members list",
          });
      } else {
        delete foundMemberObj._id;
        delete foundMemberObj.__v;
        const addMember = await ActiveMember.create(foundMemberObj);
        // console.log(addMember);
        return res.status(200).json({ message: "add member" });
      }
    }
  }
);

module.exports = member_router;

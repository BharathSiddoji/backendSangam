const mongoose = require("mongoose");

const activeMemberSchema = mongoose.Schema({
  image:{
    type:Buffer,
    required:true
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  whatsAppNumber:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: [true, "email address is required"],
  },
  sonof: {
    type: String,
    required: [true, "father name is required"],
  },
  dob: {
    type: String,
    required: [true, "Date of birth is required"],
  },
  pob: {
    type: String,
    required: [true, "place of birth is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  qualification: {
    type: String,
    required: [true, "Qualification is required"],
  },
  tamil: {
    type: String,
    required: [true, "Do you know tamil field is required"],
  },
  rws:[],
  intrested:{
    type:String,
  },
  employmentStatus: {
    type: String,
    required: [true, "Employement status is requird"],
  },
  familyMembers:[{}],
  createdAt: {
    type: Date,
    default: new Date(),
  },
},
{ versionKey: false });



const ActiveMember = mongoose.model("ActiveMember",activeMemberSchema)

module.exports = ActiveMember;
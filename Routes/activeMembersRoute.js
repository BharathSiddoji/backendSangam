const express = require("express");
const activeMembers_router = express.Router();

const isAuthenticated = require("../Middleware/authMiddleware");
const activeMember = require("../Models/activeMember");
const cookieParser = require("cookie-parser");
const ActiveMember = require("../Models/activeMember");


activeMembers_router.get('/activeMembers',isAuthenticated,async(req,res)=>{
    const allMembers = await ActiveMember.find()
    res.status(200).json(allMembers)
})

activeMembers_router.get('/activeMembers/:id',isAuthenticated,async(req,res)=>{
    const {id}= req.params
    if(id){
        const foundMember = await ActiveMember.findOne({_id:id})
        return res.status(200).json(foundMember)
    }
    res.status(200).json({message:"no id Provided"})
})
activeMembers_router.delete('/activeMembers/:id',isAuthenticated,async(req,res)=>{
    const {id}= req.params
    if(id){
        const foundMember = await ActiveMember.findOneAndDelete({_id:id})
        return res.status(200).json({message:"Deleted the Member from Sangam"})
    }
    res.status(200).json({message:"no id Provided"})
})

module.exports = activeMembers_router;
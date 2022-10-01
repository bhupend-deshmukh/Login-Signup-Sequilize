const express = require('express');
const bcrypt = require("bcrypt");

const auth = require('../middlewares/auth');
const modals = require('../models')
const path = require("path");
const User = modals.User
const jwt = require("jsonwebtoken")
const fs = require("fs")


register = (req,res)=>{
    const {firstName,lastName,email,password} = req.body

    if (firstName === undefined || lastName === undefined || email === undefined || password === undefined){
        return res.send({status:"error",message:"body data is empty...",})
    }
    let NewPassword = bcrypt.hashSync(password, 10);
    console.log(NewPassword);
    let Img = req.files.img;
    let img_link = req.files.img.name;

    Img.mv(path.join(__dirname, "..", "/files/" + img_link), (err) => {
        if(err){
            return res.send({status:"error", message: err.message });
        }
        else{
            User.create({firstName,lastName,email,password:NewPassword,img_link}).then((data)=>{
                const user_id = data.dataValues.id
                res.send({status:"success",message:"user register successfully...",user_details:{
                    user_id,
                    firstName,
                    lastName,
                    email,
                    NewPassword,
                }})
            }).catch((error)=>{
                res.send({status:"error",message:error.message})
            })
        }   
    })
}

login = (req,res)=>{
    const {email,password} = req.body
    if(email === undefined,password === undefined){
        return res.send({status:"error",message:"body data is empty..."})
    }
    User.findOne({
        where: {
            email: req.body.email 
        }
    }).then(function (data) {
        if(data === null){
            return res.send({ status: "error", message: "Invalid Email Address." })
        }else{
            if (bcrypt.compareSync(password, data.password)){
                const token = jwt.sign({ id: data.id }, "iamsecret");
                res.cookie("JWT_TOKEN", token);
                res.send({status:"success",message:"Login succesfully....",data:data,token:token})
            }else{
                res.send({status:"error",message:"Envalid email or password...."})
            }
        }
    })
}

updateUser = (req,res)=>{
    if(req.files === null){
        return res.send({status:"error",message:"body data is empty..."})
    }
    let login_id = res.tokendata.id;
    let Img = req.files.img;
    let img_link = req.files.img.name;  
    
    User.findOne({
        where:{id:login_id} 
    }).then((data)=>{

        if (data === null) {
            return   res.send({status:"error",message:"Invalid id...."})
        }else{
            let old_link = data.img_link
            Img.mv(path.join(__dirname, "..", "/files/" + old_link), (err) =>{
                if(err){
                    return res.send({status:"error", message: err.message });
                }else{
                    User.update({ img_link:img_link }, {
                        where: {
                          id: login_id
                        }
                    }).then((data)=>{
                        
                        fs.unlink(`./src/files/${old_link}`, function(err) {
                            
                            if(err){
                               return res.send({status:"error",message:err.message})
                            }

                           return res.send({status:"success",message:"user data updated successfully..."})
                        })
                    }).catch((error)=>{
                        res.send({status:"error",message:error.message})
                    })
                }
            })
        }
    }).catch(err=>console.log(err))
}


module.exports = {register,login,updateUser};
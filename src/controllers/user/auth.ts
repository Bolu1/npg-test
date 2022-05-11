import express, {Request, Response } from 'express'
import { createUserInput } from '../../schema/user.schema'
const bcrypt = require ('bcrypt')
const jwt =  require ('jsonwebtoken')
const db = require('../../utils/connect')
const transporter = require('../../utils/mailer')

// confirmation
exports.confirmation = async(req:Request,res:Response)=>{
    try{
        const {email} = jwt.verify(req.params.token, process.env.SECERET_KEY)
        const confirmed = true
        const sql = `UPDATE users SET confirmed = ${confirmed} WHERE email = '${email}'`
        const query = db.query(sql, (err:any, result:any)=>{
        if(err) throw err
        console.log(result)
        res.status(200).send("Users updated")
    })
    }catch(e){
        res.status(500).send('The Link has expired')
    }
}

//addUser
exports.addUser = async(req:Request<{}, {}, createUserInput['body']>,res:Response)=>{
    try{
    //destructure body
    const {email, password, name, phone} = req.body
    //hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    //payload to the database
    const post = {
        email:email,
        password:hashedPassword,
        name: name,
        phone: phone
    }

        //check if user exists
        const sqll = `INSERT INTO users SET ?`
        const sql = `SELECT * FROM users WHERE email = '${email}'`
        const query = await db.query(sql, async(err:any, result:any)=>{
        if(err) throw err
        if(result[0]){
            return res.status(409).send('User already exists')
       }else{
        const results = await db.query(sqll, post, async(err:any, result:any)=>{
            if(err) {
                console.log(err)
                    return res.status(400).send('something went wrong')
            }
            try{
                // No need to send verification mail with signed token
                 res.status(201).send('User added successfully you do not need to verify your email')
            }catch(err){
                console.log(err)
                res.status(500).send("sometyhing went wrong")
            }
            
          })
       }
    })
   }catch(error){
      console.log(error)
    }
}

exports.signin = async(req:Request<{}, {}, createUserInput['body']>,res:Response)=>{
   try{
    const {email, password} = req.body
    var valid:any
    //check if user exists
    const sql = `SELECT * FROM users WHERE email = '${email}'`
    try{
        const query = await db.query(sql, (err:any, result:any)=>{
        if(err) throw err
        if(!result.length){
            return res.status(400).send('Invalid login parameters')
       }
        const {email, id, name, groupId} = result[0]
        const pass = result[0].password
       //signin the user
       const fetch = async() =>{
         valid = await bcrypt.compare(password, pass)
         if(!valid){
            return res.status(400).send('Invalid login parameters')
        }else{
         const token = jwt.sign({email:email, id:id, name:name, groupId:groupId}, process.env.SECERET_KEY, {expiresIn: "48h"})
         res.status(200).json({token:token,
                                email: email,
                                name: name,
                                message: "Please add this token with the Bearer keyword to your headers"
                                
        })
        }
       }
       fetch() 
       
      
    })
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }}catch(error){
        res.status(500).send("Something went wrong")
    }
}

exports.getUsers = async(req:Request,res:Response)=>{
        const sql = 'SELECT * FROM users'
        const query  = db.query(sql, (err:any, results:any)=>{
            if(err){
                console.log(err)
                return res.status(404).send('No user found')
            }
            res.status(200).send(results)
        })
}
 
exports.forgotPassword = async(req:Request,res:Response)=>{
    const {email} = req.body
    const sql = `SELECT * FROM users WHERE email = '${email}'`
    await db.query(sql, async(err:any, result:any)=>{
        if(err){
            res.status(500).send("Something went wrong")
        }else{
            if(!result.length){
                res.send(409).send("This email is not valid")
            }else{
                try{
                    // send verification mail with signed token
                    const emailToken = jwt.sign({email:email}, process.env.SECERET_KEY, {expiresIn: "1d"})
                    const url = `http://localhost:8080/check?token=${emailToken}`
                    await transporter.sendMail({
                        to:email, 
                        subject: 'Confirm Email',
                        html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
                    })
                     res.status(200).send('Sent mail')
                }catch(err){
                    console.log(err)
                    res.status(500).send("something went wrong")
                }
            }
        }
    })
}

exports.confirmPassword = async(req:Request,res:Response)=>{
    try{
        const {email} = jwt.verify(req.body.token, process.env.SECERET_KEY)
        const {password} = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        const sql = `UPDATE users SET password = ${hashedPassword} WHERE email = '${email}'`
        const query = db.query(sql, (err:any, result:any)=>{
        if(err) throw err
        console.log(result)
        res.status(200).send("Users updated")
    })
    }catch(e){
        res.status(500).send('The Link has expired')
    }
}

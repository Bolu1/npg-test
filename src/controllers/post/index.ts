import express, {query, Request, Response } from 'express'
const db = require('../../utils/connect')

exports.addEvent = async(req:Request, res:Response) =>{

    try{
        
        const sql = "INSERT INTO posts SET ?"
        const payload = {...req.body, isEvent: true}
        await db.query(sql, payload, (err:any, result:any)=>{
            if(err){
                console.log(err)
                res.status(500).send("Something went wrong")
            }else{
                res.status(200).send("added")
            }
        })
    }catch(error){
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}

exports.addPost = async(req:Request, res:Response) =>{

    try{
        
        const sql = "INSERT INTO posts SET ?"
        await db.query(sql, req.body, (err:any, result:any)=>{
            if(err){
                console.log(err)
                res.status(500).send("Something went wrong")
            }else{
                res.status(200).send("added")
            }
        })
    }catch(error){
        console.log(error)
        res.status(500).send("Something went wrong")
    } 
}

exports.getEvent = async(req:Request, res:Response)=>{

    try{

        const sql = 'SELECT * FROM posts  WHERE isEvent = 1'
        await db.query(sql, (err:any, results:any)=>{
        if(err){
            console.log(err)
            return res.status(404).send('No paid order found')
        }
        res.status(200).send(results)
    })
    }catch(error){
        res.status(500).send("Something went wrong")
    }

}

exports.getPost = async(req:Request, res:Response)=>{

    try{

        const sql = 'SELECT * FROM posts  WHERE isEvent = 0'
        await db.query(sql, (err:any, results:any)=>{
        if(err){
            console.log(err)
            return res.status(404).send('No paid order found')
        }
        res.status(200).send(results)
    })
    }catch(error){
        res.status(500).send("Something went wrong")
    }
}

exports.getOnePost =  async(req:Request,res:Response)=>{
    try{

    
    const id = req.params.id
    console.log(id)
    const sql =  `SELECT * FROM posts WHERE id=${id}`
    await db.query(sql, (err:any, result:any)=>{
        if(err){
            res.status(500).send("Something went wrong")
        }else{
            console.log(result)
            res.status(200).send(result)
        }
    })
    }catch(err){
        res.status(500).send("Something went wrong")
    }
}

exports.deletePost =  async(req:Request,res:Response)=>{
    try{
    const id = req.params.id
    console.log(id)
    const sql = `DELETE FROM posts WHERE id = ${id}`
    await db.query(sql, (err:any, result:any)=>{
        if(err) {
            console.log(err)
            res.status(500).send("Something went wrong")
        }else{
            res.status(200).send("Post has been removed")
        }
    })
    }catch(error){
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}
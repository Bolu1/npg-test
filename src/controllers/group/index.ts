import express, { query, Request, Response } from "express";
const db = require("../../utils/connect");
import { createProductInput } from "../../schema/product.schema";
const jwt =  require ('jsonwebtoken')
const transporter = require('../../utils/mailer')

//insert product
exports.create = async (req: Request, res: Response) => {
  try {
    const post = {
      name: req.body.name,
      description: req.body.description,
      max: req.body.max,
      public: req.body.public,
      amount: req.body.amount,
      admin: res.locals.user.id,
    };
    const sql = "INSERT INTO groups SET ?";
    await db.query(sql, post, async (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occured please check your input");
      } else {
        const sql = `UPDATE users
    SET groupId = ${result.insertId} WHERE id = ${res.locals.user.id}`;
        await db.query(sql, (err: any, result: any) => {
          if (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
          } else {
            res.status(201).send("Group created sucessfully");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get all group
exports.get = async (req: Request, res: Response) => {
  try {
    const sql = "SELECT * FROM groups WHERE public = 1";
    await db.query(sql, (err: any, results: any) => {
      if (err) {
        console.log(err);
        return res.status(404).send("No group found");
      }
      res.status(200).send(results);
    });
  } catch (error) {
    console.log(error);
  }
};

//get one group
exports.getOneGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM groups WHERE id=${id}`;
    await db.query(sql, (err: any, result: any) => {
      if (err) {
        res.status(500).send("Something went wrong");
      } else {
        if (!result[0]) {
          return res.status(404).send("Product not found");
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

//product search
exports.search = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const sql = `SELECT *
    FROM groups
    WHERE description REGEXP '${query}' OR name REGEXP '${query} AND public = 1'`;
    await db.query(sql, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


//join group
exports.join = async (req: Request, res: Response) => {
  const id = res.locals.user.id;
  const groupId = req.params.group;
  const user = res.locals.user
  var users

  // if (res.locals.user.group == groupId) {
  //   return res.status(400).send("You are already in this group");
  // }

  // check if the group exists and is public
  const sqll = `SELECT * FROM groups WHERE id=${groupId} AND public = 1`;
  await db.query(sqll, async (err: any, result: any) => {
    if (err) {
      return res.status(500).send("Something went wrong");
    } else {
      if (!result[0]) {
        return res.status(404).send("Group not found");
      } else {
        const sql = `UPDATE users
    SET  groupId = ${groupId}, amount = 0 WHERE id = ${id}`;
        await db.query(sql, async(err: any, result: any) => {
          if (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
          } else {
            // check if a collection exists for a  group
            const sql = `SELECT * FROM collections WHERE groupId=${groupId}`;
            await db.query(sql, async(err: any, result: any) => {
              if (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
              } else {
                if(!result[0]){
                  return res.status(200).send("You have joined this group sucessfully")
                }else{
                users = JSON.parse(result[0].users)
                users.push(user)
                const u = JSON.stringify(users)
                const sql = `UPDATE collections
                SET users = '${u}' WHERE groupId = ${groupId}`;
                    await db.query(sql, (err: any, result: any) => {
                      if (err) {
                        console.log(err);
                        res.status(500).send("Something went wrong");
                      } else {
                        res.status(200).send("You have been added to the group sucessfully");
                      }
                    });
              }
            }
            });
          }
        });
      }
    }
  });
};

exports.getMembers = async (req: Request, res: Response) => {
  try {
    const id = res.locals.user.id;
    const groupId = req.params.group;
    const sql = `SELECT *
    FROM groups
    WHERE id = ${groupId}`;
    await db.query(sql, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        if (!result[0]) {
          return res.status(400).send("Group does not exsist");
        }
        if (result[0].admin != id) {
          return res.status(403).send("Unauthorized");
        } else {
          const sql = `SELECT id, email, name FROM users WHERE groupId = ${groupId}`;
          const query = db.query(sql, (err: any, results: any) => {
            if (err) {
              console.log(err);
              return res.status(404).send("No user found");
            }
            res.status(200).send(results);
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.invite = async (req: Request, res: Response) => {
  try {
    const id = res.locals.user.id;
    const groupId = req.body.group;
    const email = req.body.email
    const sql = `SELECT *
    FROM groups
    WHERE id = ${groupId}`;
    await db.query(sql, async (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong please check your input");
      } else {
        if (!result[0]) {
          return res.status(400).send("Group does not exsist");
        }
        if (result[0].admin != id) {
          return res.status(403).send("Unauthorized");
        } else {
          const sql = `SELECT * FROM users WHERE email = '${email}'`;
          await db.query(sql, async(err: any, result: any) => {
            if (err) {
              console.log(err);
              res.status(500).send("Something went wrong please check your input");
            } else {
              if(!result[0]){
                return res.status(400).send("This is not a registerd user")
              }else{

                const emailToken = jwt.sign({email:email, id:req.body.group}, process.env.SECERET_KEY, {expiresIn: "1d"})
                    const url = `http://localhost:8080/v1/group/process?token=${emailToken}`
                    await transporter.sendMail({
                        to:email, 
                        subject: 'Confirm Email',
                        html: `You have been invited to join  savings group, please click this link to join: <a href="${url}">${url}</a>`,
                    })
                    res.status(200).send("Invite sent please check your email or spam for a link")
              }

            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong please check your input")
  }
};

exports.process = async (req: Request, res: Response) => {
  try {
    const token = req.query.token;
    const {id, email} = jwt.verify(token, process.env.SECERET_KEY)
    const sql = `UPDATE users SET groupId = ${id} WHERE email = '${email}'`;
    await db.query(sql, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send("You have joined this group");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong")
  }
};
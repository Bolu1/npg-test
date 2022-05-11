import express, { query, Request, Response } from "express";
const db = require("../../utils/connect");

//begin tenure
exports.begin = async (req: Request, res: Response) => {
  try {
    const groupId = req.body.group;
    var users;

    const sql = `SELECT * FROM groups WHERE id=${groupId}`;
    await db.query(sql, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
          if(!result[0]){
              return res.status(404).send("No group found")
          }
        if (result[0].admin != res.locals.user.id) {
          return res.status(403).send("Unauthorized");
        } else {
          //get all the members of te group randomly
          const sql = `SELECT id, email, name, groupId FROM users WHERE groupId = ${groupId} ORDER BY RAND()`;
          const query = db.query(sql, async (err: any, results: any) => {
            if (err) {
              console.log(err);
              return res.status(404).send("No user found");
            } else {
              // check if a collection table with that id exists
              users = results;
              const sql = `SELECT * FROM collections WHERE groupId = ${groupId}`;
              await db.query(sql, async (err: any, results: any) => {
                if (err) {
                  console.log(err);
                  return res.status(404).send("No group found");
                }
                //   if it exists delete it
                if (results[0]) {
                  const sql = `DELETE FROM collections WHERE groupId = ${groupId}`;
                  await db.query(sql, async (err: any, result: any) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send("Something went wrong");
                    } else {
                      //   if not add the users
                      const sql = "INSERT INTO collections SET ?";
                      const post = {
                        groupId: groupId,
                        users: JSON.stringify(users),
                      };
                      await db.query(
                        sql,
                        post,
                        async (err: any, result: any) => {
                          if (err) {
                            console.log(err);
                            res
                              .status(500)
                              .send("An error occured please check your input");
                          } else {
                            res.status(201).send("Tenure created");
                          }
                        }
                      );
                    }
                  });
                } else {
                  //   if not add the users
                  const sql = "INSERT INTO collections SET ?";
                  const post = {
                    groupId: groupId,
                    users: JSON.stringify(users),
                  };
                  await db.query(sql, post, async (err: any, result: any) => {
                    if (err) {
                      console.log(err);
                      res
                        .status(500)
                        .send("An error occured please check your input");
                    } else {
                      res.status(201).send("Tenure created");
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.get = async (req: Request, res: Response) => {
  const groupId = req.params.id;
  // check if the user belongs the group
  const sql = `SELECT * FROM collections WHERE groupId=${groupId}`;
  await db.query(sql, async (err: any, result: any) => {
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    } else {
        if(!result[0]){
            return res.status(404).send("Tenure does not exist")
        }
      const response = JSON.parse(result[0].users);
      return res.status(200).json({
        message: "These are the users that were randomly chosen to collect",
        users: response,
      });
    }
  });
};

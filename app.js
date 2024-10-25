const express = require("express");
const {open}= require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const dbPath = path.join(__dirname,"contactdetails.db");
let db=null;
const app = express();
app.use(express.json());

const initializeDBAndServer = async () => {
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      app.listen(4002, () => {
        console.log("Server Running at http://localhost:4002/");
      });
    } catch (e) {
      console.log(`DB Error: ${e.message}`);
      process.exit(1);
    }
  };
  initializeDBAndServer();
app.get("/",(request,response)=>{
    response.send('successfully')
});

//Get contact
app.get("/contact/",async(request,response)=>{
    const query = `SELECT * FROM contact`
    const result = await db.all(query);
    response.send(result);
})


//Get 

app.get("/contact/:contact_id",async(request,response)=>{
    const {contact_id} = request.params;
    const query = `SELECT * FROM contact WHERE id = '${contact_id}';`;
    const result = await db.get(query);
    response.send(result)
})

//Insert values

app.post("/contact/", async (request, response) => {
    const contactDetails = request.body;
    const {
      id,
      name,
      email,
      address,
      phoneno
    } = contactDetails;
    const addBookQuery = `
      INSERT INTO
        contact (id,name,email,address,phoneno)
      VALUES
        (
          '${id}',
           ${name},
           ${email},
           ${address},
           ${phoneno},
         
        );`;
  
    const dbResponse = await db.run(addBookQuery);
    response.send("Added Successfully")
  });


//Update contact
  app.put("/contact/:contact_id", async (request, response) => {
    const { contact_id } = request.params;
    const contactDetails = request.body;
    const {
    
      name,
      email,
      address,
      phoneno
    } = contactDetails;
    const updateContactQuery = `
      UPDATE
        contact
      SET
        name='${name}',
        email=${email},
        address=${address},
        phoneno=${phoneno},
       
      WHERE
        id = ${contact_id};`;
    await db.run(updateContactQuery);
    response.send("contact Updated Successfully");
  });

//Rest api

  app.get("/contact/", async (request, response) => {
    const {
       limit,
      order,
      order_by,
      search_q = "",
    } = request.query;
    const getContactQuery = `
      SELECT
        *
      FROM
       contact
      WHERE
       name LIKE '%${search_q}%'
      ORDER BY ${order_by} ${order}
      LIMIT ${limit}
      `;
    const contactArray = await db.all(getContactQuery);
    response.send(contactArray);
  });

//user created
  app.post("/users/",async(request,response)=>{
    const {username,name,password} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = `SELECT * FROM users WHERE username=${username};`;
    const dbUser = await db.get(selectUserQuery);
    
    if (dbUser === undefined){
        const createQuery = `INSERT INTO users (username,name,password)
                                         VALUES ('${username}','${name}','${hashedPassword}');`;

                           await db.run(createQuery);
                           response.send("User created Successfully")              
    }else{
        response.status(400);
        response.send("user name already exists");
    }



  });

  module.exports=app;
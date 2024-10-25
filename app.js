const express = require("express");
const {open}= require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { request } = require("http");
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

app.get("/contact/",async(request,response)=>{
    const query = `SELECT * FROM contact`
    const result = await db.all(query);
    response.send(result);
})

app.get("/contact/:contact_id",async(request,response)=>{
    const {contact_id} = request.params;
    const query = `SELECT * FROM contact WHERE id = '${contact_id}';`;
    const result = await db.get(query);
    response.send(result)
})

app.post("/contact/", async (request, response) => {
   
    const contactQuery = `
      INSERT INTO
        contact (id,name,email,address,phoneno)
      VALUES
        (4,'stu','stu@gmail.com','mumbai',4444444444),
        (5,'pqr','pqr@gmail.com','goa','8787878787);`;
  
    const dbResponse = await db.run(contactQuery);
    
    response.send(dbResponse);
  });
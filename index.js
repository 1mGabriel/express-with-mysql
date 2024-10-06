const express = require("express")
const mysql = require("mysql")
const app = express()
const exphbs = require("express-handlebars")

// CONFIGURAÇÕES DO HANDLEBARS
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.use(express.static('public'))
//

// ACEITAR AS INFORMAÇÕES EM JSON:
app.use(
    express.urlencoded({
        extended:true
    })
)
app.use(express.json())
// 


// criando a conexão com o banco de dados MYSQL
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"

})
conn.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("CONECTOU AO MYSQL")
})
//

//POST
app.post('/register', (req,res)=>{

    // PEGANDO OS VALORES DO BODY DA REQUISIÇÃO E ATRIBUINFO Á CONSTANTES

    const name = req.body.person_name
    const age = req.body.person_age
    const email = req.body.person_email

    // COMANDO MYSQL PARA O POST:
    const sqlComand = `INSERT INTO  person (person_name, person_age, person_email) VALUES ('${name}', '${age}', '${email}')`
     conn.query(sqlComand, (err)=>{
        if(err){
            console.log(err)
        }
        res.redirect("/")
    })
})
//


// // GET INDIVIDUAL POR ID
// GET POR ID:
app.get('/person/:id', (req, res) =>{
    const id = req.params.id
    const sqlCommnad = `SELECT * FROM person WHERE idperson = ${id}`

    

    conn.query(sqlCommnad, (err, data)=>{
        if(err){

            console.log(err)
            return
        }

        const person = data[0]
        res.render('personid' , {person})
    })
    
})
///

// FAZENDO A EDIÇÃO DOS DADOS: (PARTE-1)

 app.get('/person/edit/:id', (req, res)=>{
    const id = req.params.id
 
    const sqlCommnad = `SELECT * FROM person WHERE idperson = ${id}`

    conn.query(sqlCommnad, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        const person = data[0]
        
        res.render('editperson' , {person})
        
    })
})

// FAZENDO A EDIÇÃO DOS DADOS: ATUALIZAÇÃO (PARTE-2)
app.post('/person/updateperson', (req, res) =>{
    const id = req.body.id
    const name = req.body.person_name
    const age = req.body.person_age
    const email = req.body.person_email

     const sqlCommand = `UPDATE person SET person_name = '${name}',  person_age = '${age}', person_email= '${email}'  WHERE idperson = ${id}`

     conn.query(sqlCommand, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        res.redirect("/person")
        
     
        
    })

    })
//

//REMOVENDO DADOS:
app.post('/person/remove/:id', (req, res)=>{
    const id = req.params.id

    const sqlCommand = `DELETE FROM person WHERE idperson = ${id}`
    conn.query(sqlCommand, (err) =>{
        if(err){
            console.log(err)
            return
        }
        res.redirect("/person")
    })
})


//GET
app.get('/person', (req, res) =>{
    
    const sqlComand = "SELECT * FROM person"
    conn.query(sqlComand, (err, data) =>{
        if(err){
            console.log(err)
            return
        }
        const persons = data
        res.render('person' , {persons} )
    })
})


app.get("/" , (req, res)=>{

    res.render('form')
})



app.listen(3000)
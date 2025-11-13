require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/db.js')
const app = express()
const morgan = require('morgan')
const port = process.env.PORT 
app.use(express.static('dist'))

app.use(cors())
morgan.token('content', function getPostContent (request) {
    let text = JSON.stringify(request.body)
    return text
})
app.use(morgan('tiny'))

var data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => 
        response.send(persons)
    )    
})

app.get('/api/persons/:id',(request, response) => {
    Person.findById(request.params.id).then(person =>
        response.send(person)
    )
    //response.status(404).send()
})

app.get('/api/info', (request, response) =>{
    var reqtime = Date(Date.now()).toString()
    var dateNum = data.length
    var resText = (`<h1>Phonebook has info for ${dateNum} people.</h1>, 
        <h2>${reqtime}</h2>`)
    response.send(resText)
})

app.delete('/api/persons/:id',(request, response) => {
    //var deleteId = request.params.id
    //var deleteTarget = data.find(person => person.id === deleteId)
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
        response.send(204).send(deleted).end()
    })
        .catch(error => 
            next(error)
        )
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.post('/api/persons', (request, response) => {
    if (!request.body){
        response.status(400).json({error: 'missing content'})
    }

    var person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
//    var newPerson = request.body
//    var idCheck = data.find(person => person.id === newID)
//    var nameCheck = data.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    
//    if (nameCheck){
//        response.status(409).send(`<h1>New Person: ${newPerson.name} already exist!</h1>`)
//   }
    
})


app.listen(port, () =>{
    console.log(`test server running on port ${port}`)}
)

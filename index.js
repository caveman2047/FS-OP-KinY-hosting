const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const PORT = process.env.PORT || 3001
app.use(express.static('dict'))

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
    response.send(data)
})

app.get('/api/persons/:id',(request, response) => {
    const id = request.params.id
    const personInfo = data.find(person => person.id === id)
    if (personInfo) {
        response.send(personInfo)
    } else {
        response.status(404).send()
    }
})

app.get('/api/info', (request, response) =>{
    var reqtime = Date(Date.now()).toString()
    var dateNum = data.length
    var resText = (`<h1>Phonebook has info for ${dateNum} people.</h1>, 
        <h2>${reqtime}</h2>`)
    response.send(resText)
})

app.delete('/api/persons/:id',(request, response) => {
    var deleteId = request.params.id
    var deleteTarget = data.find(person => person.id === deleteId)
    if (deleteTarget){
        //data = data.map(person => person.id !== deleteId)
        response.status(204).send('deleted')
    } else {
        response.status(404).end()
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.post('/api/persons', (request, response) => {
    var newPerson = request.body
    var newID = Math.floor(Math.random()*1000+4)
    var idCheck = data.find(person => person.id === newID)
    var nameCheck = data.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    if (newPerson.id === '' || newPerson.number === '') {
        response.status(409).send(`<h1>Name and number entry must not be left empty!</h1>`)
    }
    if (nameCheck){
        response.status(409).send(`<h1>New Person: ${newPerson.name} already exist!</h1>`)
    }
    if (!idCheck) {
        newPerson["id"] = newID
        data.concat(newPerson)
        console.log('new person: ' + newPerson)
        response.json(newPerson)
    } else {
        response.status(418).send('cant do')
    }
})


app.listen(PORT, () =>{
    console.log(`test server running on port ${PORT}`)}
)

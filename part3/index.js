const express = require('express');
const morgan = require('morgan'); 
const app = express();
app.use(express.json()); 


morgan.token('body', (req) => JSON.stringify(req.body));


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-23456"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6523122"
    }
];

app.get('/info', (request, response) => {
    const currentTime = new Date().toString();
    const personCount = persons.length;

    response.send(`
        <p>Phonebook has info for ${personCount} people</p>
        <p>${currentTime}</p>
    `);
});

// GET all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

// Generate a random ID 
const generateId = () => {
    return String(Math.floor(Math.random() * 1000000));
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

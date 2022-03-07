const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/users', (req, res) => {
    let users = fs.readFileSync('users.json');
    return res.send(users)
});

app.post('/users', (req, res) => {
    let users = fs.readFileSync('users.json');
    let data = JSON.parse(users);
    let id;
    if (data.length === 0) {
        id = 1;
    } else {
        id = data[data.length - 1].id + 1;
    }
    data.push({
        id,
        ...req.body
    });
    fs.writeFileSync('users.json', JSON.stringify(data));
    return res.send({message: 'add user'});
});

app.put('/users/:id', (req, res) => {
    const id = +req.params['id'];
    let data = fs.readFileSync('users.json');
    let users = JSON.parse(data);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = {
            id,
            ...req.body
        };
        fs.writeFileSync('users.json', JSON.stringify(users));
        return res.send({message: 'edit user'});
    } else {
        return res.status(400).send(`Not found user with id - ${id}`)
    }
})

app.delete('/users/:id', (req, res) => {
    const id = +req.params['id'];
    let data = fs.readFileSync('users.json');
    let users = JSON.parse(data);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        fs.writeFileSync('users.json', JSON.stringify(users));
        return res.send({message: 'delete user'});
    } else {
        return res.status(400).send(`Not found user with id - ${id}`)
    }
});

app.listen(4000, () => {
    console.log('start server');
});

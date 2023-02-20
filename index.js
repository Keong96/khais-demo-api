const express = require('express');
const WebSocket = require('ws')
const PORT = process.env.PORT || 8080;
var uuid = require('uuid');
const path = require('path');

const app = express();
const server = app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

const wss = new WebSocket.Server({ server },()=>{
    console.log('server started')
})

const allClient = [];

wss.on('connection', function connection(client, req) {

    client.id = uuid();
    allClient.push(client);

    var clientData = `{
        "type": "UUID",
        "sender": "Server",
        "data": "${client.id}"
    }`;

    client.send(clientData);

    client.on('message', (data) => {
        var dataJSON = JSON.parse(data)
        console.log(dataJSON);
    })

    client.on('close', () => {
        console.log('This Connection Closed!')
        console.log("Removing Client: " + client.id)
        for(var i = 0; i < allClient.length; i++)
        {              
            if (allClient[i].id === client.id)
            { 
                allClient.splice(i, 1);
                break;
            }
        }
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/getOption', (req, res) => {
    res.send(GetOption());
})

app.get('/AddPointToRed/:id', (req, res) => {

    var clientData = `{
        "type": "AddPointToRed",
        "sender": "Server",
        "data": "${req.params.id}"
    }`;

    for(var i = 0; i < allClient.length; i++)
    {              
        if (allClient[i].id === req.params.id)
        { 
            allClient[i].send(clientData);
        }
    }

    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/AddPointToBlue/:id', (req, res) => {

    var clientData = `{
        "type": "AddPointToBlue",
        "sender": "Server",
        "data": "${req.params.id}"
    }`;

    for(var i = 0; i < allClient.length; i++)
    {              
        if (allClient[i].id === req.params.id)
        { 
            allClient[i].send(clientData);
        }
    }
    
    res.sendFile(path.join(__dirname, 'index.html'));
})

function GetOption()
{
    const data = [];

    for(var i = 0; i < allClient.length; i++)
    {              
        data.push(allClient[i].id);
    }

    return data;
}

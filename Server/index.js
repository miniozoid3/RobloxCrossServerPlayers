const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Define an object to store player IDs, positions, and orientations
let playerTable = {};

app.post('/add_player', (req, res) => {
    const data = req.body;
    if ('player_id' in data && ['x', 'y', 'z', 'ox', 'oy', 'oz'].every(key => key in data)) {
        const playerId = data.player_id;
        const playerInfo = {
            position: {
                x: data.x,
                y: data.y,
                z: data.z
            },
            orientation: {
                x: data.ox,
                y: data.oy,
                z: data.oz
            }
        };
        playerTable[playerId] = playerInfo;
        res.status(200).json({ message: "Player added successfully." });
    } else {
        res.status(400).json({ error: "Missing player ID or position/orientation data." });
    }
});

app.delete('/remove_player/:player_id', (req, res) => {
    const playerId = req.params.player_id;
    if (playerId in playerTable) {
        delete playerTable[playerId];
        res.status(200).json({ message: "Player removed successfully." });
    } else {
        res.status(404).json({ error: "Player ID not found." });
    }
});

app.put('/update_player/:player_id', (req, res) => {
    const playerId = req.params.player_id;
    const data = req.body;
    if (playerId in playerTable && ['x', 'y', 'z', 'ox', 'oy', 'oz'].every(key => key in data)) {
        playerTable[playerId].position.x = data.x;
        playerTable[playerId].position.y = data.y;
        playerTable[playerId].position.z = data.z;
        playerTable[playerId].orientation.x = data.ox;
        playerTable[playerId].orientation.y = data.oy;
        playerTable[playerId].orientation.z = data.oz;
        res.json(playerTable);
    } else {
        res.json(playerTable);
    }
});

app.get('/player_table', (req, res) => {
    res.json(playerTable);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


setInterval(() => {
    console.clear(); // Clear the console
    console.log("Connected Players:");
    console.table(playerTable); // This will print the table of players
}, 5000);

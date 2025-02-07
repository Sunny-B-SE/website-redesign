 const express = require('express');
 const fs = require('fs');
 const app = express();

 app.use(express.json());

 const getMenuData = () => {
    const data = fs.readFileSync('./data/menu.json');
    return JSON.parse(data);
 }; //end getMenuData

const getReservationsData = () => {
    const data = fs.readFileSync('./data/reservations.json');
    return JSON.parse(data);
}; //end getReservationsData

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


app.get('/api/menu', (req, res) => {
    const menu = getMenuData();
    res.json(menu);
}); //end GET

app.post('/api/reservation', (req, res) => {
    const reservations = getReservationsData();
    const newReservation = req.body;

    reservations.push(newReservation);
    fs.writeFileSync('./data/reservations.json', JSON.stringify(reservations, null, 2));

    res.status(201).json({ message: 'Reservation saved.' });
}); // end POST Reservation


app.post('/api/reservation', (req, res) => {
    const reservations = getReservationsData();
    const newReservation = req.body;

    if (!newReservation.name || !newReservation.date || !newReservation.time || !newReservation.guests) {
        return res.status(400).json({ error: "All fields are required." });
    }

    reservations.push(newReservation);
    fs.writeFileSync('./data/reservations.json', JSON.stringify(reservations, null, 2));

    res.status(201).json({ message: 'Reservation saved.', reservation: newReservation });
}); //end POST Reservation Error 
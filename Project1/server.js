const { error } = require('console');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('Golden-buffet'));

const getOrderData = () => {
   try {
   const data = fs.readFileSync('./data/orders.json');
   return JSON.parse(data);
} catch (error) {
   return [];
}
}; //end getOrderData

const saveOrderData = (orders) => {
   fs.writeFileSync('./data/orders.json', JSON.stringify(orders, null, 2));
}; //end saveOrderData

const getReservationsData = () => {
   const data = fs.readFileSync('./data/reservations.json');
   return JSON.parse(data);
}; //end getReservationsData

app.post('/api/order', (req, res) => {
   const orders = getOrderData();
   const newOrder = req.body;

   if (!newOrder.items || newOrder.items.length === 0) {
       return res.status(400).json({ error: "Order must contain at least one item." });
   }

   newOrder.id = orders.length + 1;
   newOrder.timestamp = new Date().toISOString();

   orders.push(newOrder);
   saveOrderData(orders);

   res.status(201).json({ message: 'Order successfully placed!', order: newOrder });
}); //end post order

app.post('/api/reservation', (req, res) => {
   const reservations = getReservationsData();
   const newReservation = req.body;

   if (!newReservation.name || !newReservation.date || !newReservation.time || !newReservation.guests) {
      return res.status(400).json({ error: "All fields are required to make a reservation." });
   }

   reservations.push(newReservation);
   fs.writeFileSync('./data/reservations.json', JSON.stringify(reservations, null, 2));

   res.status(201).json({ message: 'Reservation saved.', reservation: newReservation });
}); // end post reservation

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Golden-buffet/Golden-buffet.html');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
 });
const Booking = require('../models/Booking')

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        booking.approved = true;

        booking.save();

        const requestingUserSocket = req.connectedUsers[booking.user];

        console.log(booking.user);
        console.log(requestingUserSocket);

        if (requestingUserSocket) {
            req.io.to(requestingUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
    }
}
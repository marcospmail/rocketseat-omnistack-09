const Booking = require('../models/Booking')

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        booking.approved = false;

        booking.save();

        const requestBookingUserSocket = req.connectedUsers[booking.user];

        if (requestBookingUserSocket) {
            req.io.to(requestBookingUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
    }
}
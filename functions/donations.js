const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')("sk_test_h3Uc9EYgdw54L0qcdniOt6ld");

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const token = req.body.token;
    const amount = req.body.amount;

    const charge = stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token,
      statement_descriptor: "SOUNDOFTEXT_DONATION"
    }, function(err, charge) {
      if (err) {
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true, charge: charge });
      }
    });
  });
});
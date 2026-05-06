const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Endpoint to get top professionals for homepage
app.get("/topprofessional", async (req, res) => {
  try {
    const profiles = await Profile.find({ rating: { $gte: 4 } }).limit(10);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment Session Creation (Initial 1/3)
app.post("/create-checkout-session", async (req, res) => {
  const { profileId, name, price, userId, professionalId, userName, scheduledDate, scheduledTime } = req.body;
  const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

  // Calculate 1/3 of the price for the initial hiring payment
  const initialPayment = Math.ceil(price / 3);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        profileId,
        userId,
        userName: userName || "Client",
        professionalId: professionalId || "",
        professionalPhone: req.body.phone || "",
        professionalName: name,
        price: initialPayment,
        fullPrice: price,
        scheduledDate,
        scheduledTime
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hiring ${name}`,
              description: `Initial 1/3 Deposit for ${scheduledDate} at ${scheduledTime}`,
            },
            unit_amount: initialPayment * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}&type=hire`,
      cancel_url: `${origin}/#/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Balance Payment Session (Remaining 2/3)
app.post("/create-balance-checkout-session", async (req, res) => {
  const { hiringId, professionalName, fullPrice } = req.body;
  const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

  // Calculate remaining 2/3
  const balanceAmount = fullPrice - Math.ceil(fullPrice / 3);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        hiringId,
        paymentType: 'balance_payment'
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Final Balance for ${professionalName}`,
            },
            unit_amount: balanceAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}&type=balance`,
      cancel_url: `${origin}/#/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { configDotenv } = require("dotenv");
const express = require("express");
configDotenv();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/create_subscription", async (req, res) => {
  try {
    const {} = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1NalrkSD5rX3MT7WSlljJVRG",
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/get_user_subscription_by_email", async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await stripe.customers.list({ email: email });
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
    });
    res.json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/get_plan_by_id", async (req, res) => {
  try {
    let { planId } = req.body;
    const plan = await stripe.plans.retrieve(planId);
    res.json({ plan: plan });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/get_subscription_by_id", async (req, res) => {
  try {
    let { subscriptionId } = req.body;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    res.json({ subscription: subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/upgrade_subscription", async (req, res) => {
  try {
    let { subscriptionId, priceId } = req.body;
    console.log(req.body);
    const currentSub = await stripe.subscriptions.retrieve(subscriptionId);
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      items: [
        {
          id: currentSub.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: "always_invoice",
    });
    res.json({ subscription: subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

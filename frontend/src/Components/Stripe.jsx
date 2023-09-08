import React, { useEffect, useState } from "react";

const Stripe = () => {
  const [userSubscription, setUserSubscription] = useState([]);
  const [current_subscription, setCurrentSubscription] = useState(null);
  const handleSubscription = async () => {
    const response = await fetch("http://localhost:5000/create_subscription", {
      method: "POST",
      headers: {},
      body: JSON.stringify({ email: "ankur1@ankur.com" }),
    });
    const data = await response.json();
    console.log(data);
    if (data.url) window.location.href = data.url;
  };

  const getUserSubscriptionByEmail = async () => {
    const response = await fetch(
      "http://localhost:5000/get_user_subscription_by_email",
      {
        method: "POST",
        headers: {},
        body: JSON.stringify({ email: "testing@ankur.com" }),
      }
    );
    const data = await response.json();
    const { subscriptions } = data;
    console.log(subscriptions);
    if (subscriptions.length > 0)
      setCurrentSubscription(
        subscriptions[0].payment_settings.payment_method_options.card
          .mandate_options.description
      );
    setUserSubscription(subscriptions);
  };

  const upgrageSubscription = async (priceId) => {
    const response = await fetch("http://localhost:5000/upgrade_subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: userSubscription[0].id,
        priceId: priceId,
      }),
    });
    const data = await response.json();
    console.log(data);
    // window.location.reload();
  };
  useEffect(() => {
    getUserSubscriptionByEmail();
  }, []);

  return (
    <div className="App">
      <h1>Stripe Payments</h1>
      <button
        onClick={() => handleSubscription("price_1NalrkSD5rX3MT7WSlljJVRG")}
      >
        Plan 1
      </button>
      <button
        onClick={() => handleSubscription("price_1NalyqSD5rX3MT7WgiekiGnZ")}
      >
        Plan 2
      </button>
      <button
        onClick={() => handleSubscription("price_1NalzeSD5rX3MT7WivvcHW0i")}
      >
        Plan 3
      </button>

      <h1>
        Cancel this Subscription{" "}
        {userSubscription.map((subscription) => (
          <div key={subscription.id}>
            <button>
              Cancel{" "}
              {
                subscription.payment_settings.payment_method_options.card
                  .mandate_options.description
              }
            </button>
          </div>
        ))}{" "}
      </h1>

      <h1>Update this Subscription </h1>
      {current_subscription === "AnkurPlan" ? (
        <>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalyqSD5rX3MT7WgiekiGnZ")
            }
          >
            AnkurPlan1
          </button>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalzeSD5rX3MT7WivvcHW0i")
            }
          >
            AnkurPlan2
          </button>
        </>
      ) : current_subscription === "AnkurPlan2" ? (
        <>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalzeSD5rX3MT7WivvcHW0i")
            }
          >
            AnkurPlan2
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalrkSD5rX3MT7WSlljJVRG")
            }
          >
            AnkurPlan
          </button>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalzeSD5rX3MT7WivvcHW0i")
            }
          >
            AnkurPlan2
          </button>
          <button
            onClick={() =>
              upgrageSubscription("price_1NalyqSD5rX3MT7WgiekiGnZ")
            }
          >
            AnkurPlan1
          </button>
        </>
      )}

      <div className="current_subscription">
        <h2>Current Subscription</h2>
        {userSubscription.map((subscription) => (
          <div key={subscription.id}>
            <h3>
              {
                subscription.payment_settings.payment_method_options.card
                  .mandate_options.description
              }
            </h3>
            <p>{subscription.plan.amount / 100}</p>
            <p>{subscription.plan.currency}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stripe;

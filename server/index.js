import express from "express";
import cors from "cors";
import paypal from "paypal-rest-sdk";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv({ path: "./.env" });

const app = express();
const PORT = 8000;

// Enable CORS for frontend
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// PayPal configuration
paypal.configure({
    "mode": "sandbox", // Use 'sandbox' or 'live'
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
});

app.get("/", (req, res)=> {
    res.status(200).json({message: "Hello from backend !"});
});

// Payment route
app.get("/payment", async (req, res) => {
    const { price } = req.query; // Get price from query params
    try {
        if (!price || isNaN(price) || price <= 0) {
            return res.status(400).send("Invalid price value");
        }

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal",
            },
            "redirect_urls": {
                "return_url": `http://localhost:8000/success?price=${price}`,
                "cancel_url": "http://localhost:8000/failed"
            },
            "transactions": [
                {
                    "item_list": {
                        "items": [
                            {
                                "name": "item",
                                "sku": "item",
                                "price": price,
                                "currency": "USD",
                                "quantity": 1,
                            },
                        ],
                    },
                    "amount": {
                        "currency": "USD",
                        "total": price,
                    },
                    "description": `Payment of $${price}`,
                },
            ],
        };

        // Create PayPal payment
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.error("Payment creation failed:", error);
                return res.status(500).send("Error creating payment");
            }
            console.log("Create Payment Response:", payment);
            res.json(payment);
        });
    } catch (error) {
        console.error("Error in /payment route:", error);
        res.status(500).send("Server error");
    }
});

// Success route
app.get("/success", async (req, res) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const price = req.query.price;

        if (!price || isNaN(price)) {
            console.error("Invalid or missing price");
            return res.redirect("http://localhost:5173/failed");
        }

        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: price, // Match price from query params
                    },
                },
            ],
        };

        paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
            if (error) {
                console.error("Payment execution failed:", error.response);
                return res.redirect("http://localhost:5173/failed");
            } else {
                console.log("Payment executed successfully:", payment);
                return res.redirect("http://localhost:5173/success");
            }
        });
    } catch (error) {
        console.error("Error in /success route:", error);
        res.redirect("http://localhost:5173/failed");
    }
});


// Failed route
app.get("/failed", (req, res) => {
    res.redirect("http://localhost:5173/failed");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
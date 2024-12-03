💸 Payment App
==============

A dynamic PayPal payment integration app that allows users to make payments seamlessly.

🚀 Features
-----------

* Dynamic amount selection
* Integration with PayPal sandbox API
* Secure payment execution
* User-friendly UI

📖 Flow Overview
----------------

1. User selects an amount and clicks a payment button.
2. The app sends a request to the server to create a PayPal payment.
3. Server communicates with PayPal API and retrieves an **approval URL**.
4. User is redirected to PayPal to approve the payment.
5. Upon approval, PayPal redirects the user back to the app.
6. The server executes the payment using the Payer ID and Payment ID.
7. User receives a success confirmation.

🛠️ Code Snippets
-----------------

### Client-Side Code
```js
         import axios from 'axios';         
          const handlePayment = async (amount) => {             
          try {
            const res = await axios.get(`http://localhost:8000/payment?amount=${amount}`);                 
            if (res && res.data) {                     
               window.location.href = res.data.links[1].href; // Redirect to approval URL                 
            }             
          } catch (error) {
               console.error('Error:', error);
         }         
        };
```
### Server-Side Code
```js


        app.get('/payment', async (req, res) => {
           const amount = req.query.amount;
           const paymentDetails = {
              intent: "sale",
              payer: { payment_method: "paypal" },
              redirect_urls: {
                 return_url: "http://localhost:8000/success",
                 cancel_url: "http://localhost:8000/failed"
              },
              transactions: [{
                 item_list: {
                    items: [{ name: "item", price: amount, currency: "USD", quantity: 1 }]
                 },
                 amount: { currency: "USD", total: amount },
                 description: `Payment of $${amount}`
              }]
           };
           paypal.payment.create(paymentDetails, (error, payment) => {
              if (error) throw error;
              res.json(payment);
              // Send payment details to the client
           });
        });
```
🔗 Useful Links
---------------

* [PayPal Developer Site](https://developer.paypal.com/)

💡 How to Run
-------------

1. Clone the repository.
2. Install dependencies:

       npm install

3. Run the server:

       node server.js

4. Run the client:

       npm run dev

5. Visit [http://localhost:5173](http://localhost:5173) to start the app.

📋 Notes
--------

* Ensure your PayPal sandbox credentials are set in the `.env` file.
* Use the sandbox environment for testing before switching to live mode.

Made with 💸 by \[SOUMAY SANPUI\]
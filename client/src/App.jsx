import { useState } from "react";
import axios from "axios";

function App() {
    const [payoutAmount, setPayoutAmount] = useState("");

    // Predefined recipient email
    const preDefinedEmail = "recipient@example.com"; // Replace with the actual email

    // Handle Payment
    const handlePayment = async (price) => {
        try {
            const res = await axios.get(`http://localhost:8000/payment?price=${price}`);
            if (res && res.data) {
                const approvalLink = res.data.links.find((link) => link.rel === "approval_url");
                if (approvalLink) {
                    window.location.href = approvalLink.href;
                } else {
                    console.error("Approval URL not found in PayPal response");
                }
            }
        } catch (error) {
            console.error("Error during payment initiation:", error);
        }
    };

    // Handle Payout
    const handlePayout = async () => {
        if (!payoutAmount || isNaN(payoutAmount) || payoutAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/payout", [
                { amountToTransfer: parseFloat(payoutAmount), whomToTransfer: preDefinedEmail },
            ]);

            if (res && res.data) {
                alert(`Payout successful: ${JSON.stringify(res.data.payoutResponse)}`);
            }
        } catch (error) {
            console.error("Error during payout:", error);
            alert("Payout failed. Check the console for details.");
        }
    };

    return (
        <div
            className="w-screen h-screen bg-black/90 text-white flex flex-col text-center items-center justify-center gap-5"
        >
            <h1 className="text-4xl font-semibold">PayPal Integration</h1>

            {/* Payment Buttons */}
            <div>
                <h2 className="text-2xl mb-3">Payments</h2>
                <button className="bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300 mx-2" onClick={() => handlePayment(0.5)} >Pay $0.50 </button>
                <button className="bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300 mx-2" onClick={() => handlePayment(1)} >Pay $1.00 </button>
                <button className="bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300 mx-2" onClick={() => handlePayment(1.5)} >Pay $1.50 </button>
                <button className="bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300 mx-2" onClick={() => handlePayment(2)} >Pay $2.00 </button>
            </div>

            {/* Payout Section */}
            <div className="mt-10">
                <h2 className="text-2xl mb-3">Payout</h2>
                <input
                    type="number"
                    placeholder="Amount to Transfer"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="p-2 rounded-sm mb-3 text-black"
                />
                <button
                    className="bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300"
                    onClick={handlePayout}
                >
                    Send Payout
                </button>
            </div>
        </div>
    );
}

export default App;

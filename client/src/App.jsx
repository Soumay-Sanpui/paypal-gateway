import axios from "axios";

function App() {
    const handlePayment = async (price) => {
        try {
            const res = await axios.get(`http://localhost:8000/payment?price=${price}`);
            if (res && res.data) {
                const approvalLink = res.data.links.find(
                    (link) => link.rel === "approval_url"
                );
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

    return (
        <div className={"w-screen h-screen bg-black/90 text-white flex flex-col text-center items-center justify-center gap-5"}>
            <h1 className={"text-4xl font-semibold"}>PayPal Payment Integration</h1>
            <button className={"bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300"} onClick={() => handlePayment(0.5)}>Pay $0.50</button>
            <button className={"bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300"} onClick={() => handlePayment(1)}>Pay $1.00</button>
            <button className={"bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300"} onClick={() => handlePayment(1.5)}>Pay $1.50</button>
            <button className={"bg-white text-black p-2 rounded-sm shadow-sm shadow-orange-300"} onClick={() => handlePayment(2)}>Pay $2.00</button>
        </div>
    );
}

export default App;

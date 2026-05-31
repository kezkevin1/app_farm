import { useState, useEffect } from "react";

export default function FarmApp() {
  const [capital, setCapital] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [stock, setStock] = useState({});

  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseItem, setExpenseItem] = useState("");

  const [saleQty, setSaleQty] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleCrop, setSaleCrop] = useState("");

  const [addStockQty, setAddStockQty] = useState("");
  const [stockCrop, setStockCrop] = useState("");

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // ✅ Load saved data
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("farmData"));
    if (data) {
      setCapital(data.capital || 0);
      setExpenses(data.expenses || []);
      setSales(data.sales || []);
      setStock(data.stock || {});
    }
  }, []);

  // ✅ Save data
  useEffect(() => {
    localStorage.setItem(
      "farmData",
      JSON.stringify({ capital, expenses, sales, stock })
    );
  }, [capital, expenses, sales, stock]);

  // ✅ Install prompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const totalSales = sales.reduce((a, b) => a + b.total, 0);
  const currentCash = capital - totalExpenses + totalSales;

  const addExpense = () => {
    if (!expenseAmount || !expenseItem) return;
    setExpenses([
      ...expenses,
      { item: expenseItem, amount: parseFloat(expenseAmount) },
    ]);
    setExpenseAmount("");
    setExpenseItem("");
  };

  const addSale = () => {
    if (!saleQty || !salePrice || !saleCrop) return;
    const total = parseFloat(saleQty) * parseFloat(salePrice);

    setSales([
      ...sales,
      { crop: saleCrop, qty: parseFloat(saleQty), total },
    ]);

    setStock({
      ...stock,
      [saleCrop]: (stock[saleCrop] || 0) - parseFloat(saleQty),
    });

    setSaleQty("");
    setSalePrice("");
    setSaleCrop("");
  };

  const addStock = () => {
    if (!addStockQty || !stockCrop) return;

    setStock({
      ...stock,
      [stockCrop]: (stock[stockCrop] || 0) + parseFloat(addStockQty),
    });

    setAddStockQty("");
    setStockCrop("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* ✅ Install Button */}
      <button
        onClick={installApp}
        style={{
          padding: "10px",
          background: "green",
          color: "white",
          border: "none",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        📱 Install App
      </button>

      <h1>🌾 Farm Records App</h1>

      <h2>Dashboard</h2>
      <p>Capital: UGX {capital}</p>
      <p>Expenses: UGX {totalExpenses}</p>
      <p>Sales: UGX {totalSales}</p>
      <p>Current Cash: UGX {currentCash}</p>

      <h3>Stock</h3>
      {Object.keys(stock).map((crop) => (
        <p key={crop}>
          {crop}: {stock[crop]} kg
        </p>
      ))}

      <hr />

      <h2>Set Capital</h2>
      <input
        type="number"
        onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
      />

      <h2>Add Expense</h2>
      <input
        placeholder="Item"
        value={expenseItem}
        onChange={(e) => setExpenseItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />
      <button onClick={addExpense}>Add</button>

      <h2>Add Stock</h2>
      <input
        placeholder="Crop"
        value={stockCrop}
        onChange={(e) => setStockCrop(e.target.value)}
      />
      <input
        type="number"
        placeholder="KG"
        value={addStockQty}
        onChange={(e) => setAddStockQty(e.target.value)}
      />
      <button onClick={addStock}>Add</button>

      <h2>Add Sale</h2>
      <input
        placeholder="Crop"
        value={saleCrop}
        onChange={(e) => setSaleCrop(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity (kg)"
        value={saleQty}
        onChange={(e) => setSaleQty(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price per kg"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />
      <button onClick={addSale}>Sell</button>

      <hr />

      <h2>Expense History</h2>
      {expenses.map((e, i) => (
        <p key={i}>
          {e.item} - UGX {e.amount}
        </p>
      ))}

      <h2>Sales History</h2>
      {sales.map((s, i) => (
        <p key={i}>
          {s.crop} - {s.qty}kg - UGX {s.total}
        </p>
      ))}
    </div>
  );
}
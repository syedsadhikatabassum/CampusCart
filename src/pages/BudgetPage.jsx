import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import { Meter } from "../components/BudgetPlanner";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../utils";

export default function BudgetPage() {
  const {
    budget,
    setBudget,
    expenses,
    addExpense,
    removeExpense,
    spent,
    remaining,
    cartTotal,
    products,
  } = useStore();
  const [draft, setDraft] = useState(String(budget));
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  usePageTitle("Budget planner");

  const ratio = budget > 0 ? spent / budget : 0;
  const ideas = products
    .filter((product) => remaining > 0 && product.price <= remaining)
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  const commitBudget = () => {
    if (draft.trim() === "") {
      setDraft(String(budget));
      return;
    }
    setBudget(draft);
    setDraft(String(Math.min(500000, Math.max(0, Math.round(Number(draft) || budget)))));
  };

  const onAdd = (event) => {
    event.preventDefault();
    const ok = addExpense(label, amount);
    if (!ok) {
      setFormError("Add a name and an amount above zero.");
      return;
    }
    setLabel("");
    setAmount("");
    setFormError("");
  };

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Student budget planner</h1>
        <p>
          Set a monthly stationery limit and list what you plan to spend. The numbers stay in this browser.
          The cart is separate until you add it as an expense.
        </p>
      </header>
      <div className="split">
        <section className="panel form-grid">
          <label className="field">
            Monthly budget (₹)
            <input
              value={draft}
              inputMode="numeric"
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitBudget}
            />
          </label>
          <Meter ratio={ratio} />
          <p className={remaining < 0 ? "remain negative" : "remain"}>
            {formatPrice(remaining)} left of {formatPrice(budget)}
          </p>
          <form className="expense-form" onSubmit={onAdd}>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Expense name"
              aria-label="Expense name"
            />
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Amount"
              aria-label="Amount in rupees"
              inputMode="numeric"
            />
            <button className="btn" type="submit">Add</button>
          </form>
          {formError ? <p className="err">{formError}</p> : null}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => addExpense("Current cart", cartTotal)}
            disabled={cartTotal <= 0}
          >
            Add current cart ({formatPrice(cartTotal)})
          </button>
          <ul className="expense-list">
            {expenses.length === 0 ? <li><span>No expenses yet.</span></li> : null}
            {expenses.map((item) => (
              <li key={item.id}>
                <span>{item.label}</span>
                <span>
                  <strong>{formatPrice(item.amount)}</strong>{" "}
                  <button type="button" className="text-btn" onClick={() => removeExpense(item.id)}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <aside className="panel summary">
          <h2>This month</h2>
          <div className="summary-row"><span>Budget</span><strong>{formatPrice(budget)}</strong></div>
          <div className="summary-row"><span>Spent</span><strong>{formatPrice(spent)}</strong></div>
          <div className="summary-row grand">
            <span>Remaining</span>
            <strong className={remaining < 0 ? "remain negative" : "remain"}>{formatPrice(remaining)}</strong>
          </div>
          <p className="ship-hint">
            {remaining < 0
              ? "The plan is over the limit. Remove an expense or raise the budget."
              : "Products that fit the amount left are listed below."}
          </p>
          <Link className="btn btn-ghost" to="/">Back home</Link>
        </aside>
      </div>
      <section className="related">
        <h2>Fits the remaining budget</h2>
        {ideas.length === 0 ? (
          <p className="lead">Raise the limit or remove an expense, and matching stationery will show up here.</p>
        ) : (
          <div className="catalog-grid">
            {ideas.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}

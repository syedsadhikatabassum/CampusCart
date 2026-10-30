import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { formatPrice } from "../utils";

function BudgetArt() {
  return (
    <svg className="budget-art" viewBox="0 0 120 100" aria-hidden="true">
      <rect x="34" y="18" width="62" height="74" rx="10" fill="#ecfdf5" stroke="#34d399" />
      <rect x="50" y="10" width="30" height="14" rx="6" fill="#10b981" />
      <rect x="46" y="36" width="40" height="6" rx="3" fill="#6ee7b7" />
      <rect x="46" y="50" width="32" height="6" rx="3" fill="#a7f3d0" />
      <rect x="46" y="64" width="36" height="6" rx="3" fill="#6ee7b7" />
      <circle cx="24" cy="72" r="12" fill="#fbbf24" />
      <circle cx="102" cy="30" r="8" fill="#86efac" />
    </svg>
  );
}

export function Meter({ ratio }) {
  const width = Math.max(0, Math.min(100, ratio * 100));
  const tone = ratio > 1 ? "over" : ratio > 0.8 ? "warn" : "ok";
  return (
    <div className={`meter ${tone}`} aria-hidden="true">
      <span style={{ width: `${width}%` }} />
    </div>
  );
}

export default function BudgetPlanner({ compact = false }) {
  const { budget, spent, remaining } = useStore();
  const ratio = budget > 0 ? spent / budget : 0;

  if (compact) {
    return (
      <section className="panel panel-budget" aria-label="Student budget planner">
        <div className="budget-top">
          <div>
            <h3>Student Budget Planner</h3>
            <p>Plan your spending. Get the best from your budget!</p>
            <Link className="btn" to="/budget">Try Budget Planner →</Link>
          </div>
          <BudgetArt />
        </div>
        <div className="budget-box">
          <div><span>Total Budget</span><strong>{formatPrice(budget)}</strong></div>
          <div><span>Spent</span><strong>{formatPrice(spent)}</strong></div>
          <div>
            <span>Remaining</span>
            <strong className={remaining < 0 ? "remain negative" : "remain"}>{formatPrice(remaining)}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Meter ratio={ratio} />
  );
}

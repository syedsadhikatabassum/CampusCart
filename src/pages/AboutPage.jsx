import { useState } from "react";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";

const FAQS = [
  {
    q: "Is CampusCart a real shop?",
    a: "It is a frontend project. The catalogue, cart, wishlist and budget planner run in the browser. There is no database and no payment is taken.",
  },
  {
    q: "Where does the product list come from?",
    a: "Axios requests public/products.json when the app opens. That file stands in for an API, so the same React code could later point at a real server.",
  },
  {
    q: "What stays after I refresh?",
    a: "You sign in before the shop opens. Each login keeps its own cart, wishlist, budget and profile in this browser. Clearing site data removes them.",
  },
  {
    q: "How does shipping work?",
    a: "Orders of ₹999 or more show free shipping. Smaller orders add a ₹49 delivery fee in the summary. It is a calculation only.",
  },
];

export default function AboutPage() {
  const { profile } = useStore();
  const [open, setOpen] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    message: "",
  });
  const [errors, setErrors] = useState({});
  usePageTitle("About");

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (form.message.trim().length < 8) next.message = "Write a short message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  };

  return (
    <div className="page">
      <header className="page-intro">
        <h1>About CampusCart</h1>
        <p>
          CampusCart is a student stationery shop built as a React project. It brings pens, notebooks,
          lab records and the small things a semester needs into one calm storefront.
        </p>
      </header>

      <section className="block">
        <div className="card-grid">
          <article className="info-card">
            <h2>Study today</h2>
            <p>Prices stay in a student range, and every product card shows the campus price beside the marked price.</p>
          </article>
          <article className="info-card">
            <h2>Build tomorrow</h2>
            <p>The budget planner keeps a monthly stationery limit next to the cart, so a haul does not surprise you later.</p>
          </article>
          <article className="info-card">
            <h2>Made for class</h2>
            <p>Categories follow a real college list: writing tools, lab records, files, calculators and a bag to carry them.</p>
          </article>
        </div>
      </section>

      <section className="block">
        <h2 className="block-title">Questions</h2>
        <div className="faq">
          {FAQS.map((item, index) => (
            <article className="faq-item" key={item.q}>
              <button
                type="button"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                {item.q}
                <span aria-hidden="true">{open === index ? "–" : "+"}</span>
              </button>
              {open === index ? <p>{item.a}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="block split" id="contact">
        <div>
          <h2 className="block-title">Contact</h2>
          <p className="lead">
            Send a note about the project. It stays in this browser session and is not emailed anywhere.
          </p>
        </div>
        {sent ? (
          <div className="panel">
            <h3>Message noted</h3>
            <p className="lead">Thanks, {form.name.trim()}. This demo kept your note on this page only.</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSent(false);
                setForm((current) => ({ ...current, message: "" }));
              }}
            >
              Write another
            </button>
          </div>
        ) : (
          <form className="panel form-grid" onSubmit={submit} noValidate>
            <label className="field">
              Name
              <input value={form.name} onChange={setField("name")} autoComplete="name" />
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </label>
            <label className="field">
              Email
              <input value={form.email} onChange={setField("email")} autoComplete="email" type="email" />
              {errors.email ? <span className="err">{errors.email}</span> : null}
            </label>
            <label className="field">
              Message
              <textarea value={form.message} onChange={setField("message")} />
              {errors.message ? <span className="err">{errors.message}</span> : null}
            </label>
            <button className="btn" type="submit">Send message</button>
          </form>
        )}
      </section>
    </div>
  );
}

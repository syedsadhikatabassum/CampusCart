import { useState } from "react";
import { IconShield, IconTag, IconTruck } from "./Icons";
import SearchForm from "./SearchForm";

const HERO_IMAGE = "/images/hero-backpack.jpg";

export default function Hero() {
  const [ok, setOk] = useState(true);

  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Your One-Stop Stationery Shop</p>
        <h1>
          Everything You Need for a <em>Better Study Journey</em>
        </h1>
        <p className="hero-copy">
          From pens to notebooks, lab records to calculators — find all your academic essentials at CampusCart.
        </p>
        <SearchForm
          className="hero-search"
          placeholder="Search stationery..."
          withButton
        />
        <ul className="hero-points">
          <li>
            <span className="point-icon"><IconShield /></span>
            <span><b>Best Quality</b><small>Products</small></span>
          </li>
          <li>
            <span className="point-icon"><IconTag /></span>
            <span><b>Student Friendly</b><small>Prices</small></span>
          </li>
          <li>
            <span className="point-icon"><IconTruck /></span>
            <span><b>Fast & Reliable</b><small>Delivery</small></span>
          </li>
        </ul>
      </div>
      <div className="hero-visual">
        {ok ? (
          <img
            src={HERO_IMAGE}
            alt="Blue student backpack"
            fetchPriority="high"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="hero-fallback" role="img" aria-label="Campus stationery" />
        )}
        <div className="hero-tag">
          Good Things
          <small>Ahead</small>
        </div>
        <div className="hero-board">
          <span>Plan</span>
          <span>Study</span>
          <span>Achieve</span>
        </div>
      </div>
    </section>
  );
}

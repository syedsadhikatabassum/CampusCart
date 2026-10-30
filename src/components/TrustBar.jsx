import { FREE_SHIPPING_AT, formatPrice } from "../utils";
import { IconHeadset, IconPlane, IconShield, IconTruck } from "./Icons";

export default function TrustBar() {
  return (
    <section className="trust" aria-label="CampusCart promises">
      <div className="trust-item">
        <span className="trust-icon"><IconTruck /></span>
        <div>
          <strong>Free Shipping</strong>
          <span>On orders over {formatPrice(FREE_SHIPPING_AT)}</span>
        </div>
      </div>
      <div className="trust-item">
        <span className="trust-icon"><IconShield /></span>
        <div>
          <strong>Secure Payments</strong>
          <span>100% safe & secure</span>
        </div>
      </div>
      <div className="trust-item">
        <span className="trust-icon"><IconHeadset /></span>
        <div>
          <strong>24/7 Support</strong>
          <span>We&apos;re here to help</span>
        </div>
      </div>
      <div className="trust-note">
        <IconPlane />
        <p>
          Because<br />
          Every Student<br />
          Deserves the Best ☺
        </p>
      </div>
    </section>
  );
}

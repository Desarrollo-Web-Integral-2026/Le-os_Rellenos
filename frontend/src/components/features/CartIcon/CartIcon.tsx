import { useCart } from "../../../hooks/useCart";
import styles from "./CartIcon.module.css";

export function CartIcon() {
  const { totalItems, openCart } = useCart();
  const label = `Abrir carrito, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;

  return (
    <button
      type="button"
      onClick={openCart}
      className={styles.iconButton}
      aria-label={label}
      title={label}
    >
      🛒
      {totalItems > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {totalItems}
        </span>
      )}
    </button>
  );
}

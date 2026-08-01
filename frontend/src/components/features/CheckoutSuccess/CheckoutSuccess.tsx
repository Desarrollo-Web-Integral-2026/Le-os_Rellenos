import { Button } from '../../ui'
import styles from './CheckoutSuccess.module.css'

interface CheckoutSuccessProps {
  onClose: () => void
}

export function CheckoutSuccess({ onClose }: CheckoutSuccessProps) {
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.icon}>✅</span>
      <h2>¡Pedido listo!</h2>
      <p>Se abrió WhatsApp para finalizar tu pedido. Si no se abrió automáticamente, revisa que tu navegador no haya bloqueado la ventana emergente.</p>
      <Button onClick={onClose}>Volver al menú</Button>
    </div>
  )
}
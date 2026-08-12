import styles from './PrivacyNoticeLink.module.css'

// TODO(RNF7): reemplazar el href="#" por la ruta real del Aviso de Privacidad
// Integral y Simplificado cuando esa issue esté lista. Este componente debe
// ser visible ANTES de que el usuario capture datos de entrega — no eliminar
// ni mover de aquí sin revisar el criterio de Actividad 1 (checklist FrontEnd).
export function PrivacyNoticeLink() {
  return (
    <p className={styles.notice}>
      Al continuar, tus datos se usarán únicamente para procesar tu pedido. Consulta nuestro{' '}
      <a href="#" className={styles.link}>
        Aviso de Privacidad
      </a>
      .
    </p>
  )
}
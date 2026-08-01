import { useState } from 'react'
import { PrivacyNoticeModal } from '../PrivacyNoticeModal/PrivacyNoticeModal'
import styles from './PrivacyNoticeLink.module.css'

export function PrivacyNoticeLink() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <p className={styles.notice}>
        Al continuar, tus datos se usarán únicamente para procesar tu pedido. Consulta nuestro{' '}
        <button type="button" className={styles.link} onClick={() => setIsModalOpen(true)}>
          Aviso de Privacidad
        </button>
        .
      </p>

      <PrivacyNoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
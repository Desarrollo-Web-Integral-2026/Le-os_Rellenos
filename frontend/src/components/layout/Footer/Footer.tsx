import { useState } from 'react'
import { PrivacyNoticeModal } from '../../features/PrivacyNoticeModal/PrivacyNoticeModal'
import styles from './Footer.module.css'

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} Leños Rellenos</span>
        <button type="button" className={styles.link} onClick={() => setIsModalOpen(true)}>
          Aviso de Privacidad
        </button>
      </div>

      <PrivacyNoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  )
}
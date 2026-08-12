import { useEffect, useState } from 'react'
import { privacyNoticeSimplified, privacyNoticeIntegral } from '../../../content/privacyNotice'
import styles from './PrivacyNoticeModal.module.css'

interface PrivacyNoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

type NoticeView = 'simplified' | 'integral'

export function PrivacyNoticeModal({ isOpen, onClose }: PrivacyNoticeModalProps) {
  const [view, setView] = useState<NoticeView>('simplified')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Siempre reinicia a la vista simplificada la próxima vez que se abra
  useEffect(() => {
    if (isOpen) setView('simplified')
  }, [isOpen])

  if (!isOpen) return null

  const content = view === 'simplified' ? privacyNoticeSimplified : privacyNoticeIntegral

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.modal}
        role="dialog"
        aria-label="Aviso de Privacidad"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2>{content.title}</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Cerrar aviso de privacidad">
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={[styles.tab, view === 'simplified' ? styles.tabActive : ''].join(' ')}
            onClick={() => setView('simplified')}
          >
            Simplificado
          </button>
          <button
            type="button"
            className={[styles.tab, view === 'integral' ? styles.tabActive : ''].join(' ')}
            onClick={() => setView('integral')}
          >
            Integral
          </button>
        </div>

        <div className={styles.body}>
          {content.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>
          ))}
          <p className={styles.updatedAt}>Última actualización: {content.updatedAt}</p>
        </div>
      </div>
    </>
  )
}
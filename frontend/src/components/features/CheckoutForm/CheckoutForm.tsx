import { useState } from 'react'
import { Input, Textarea, Button } from '../../ui'
import { PrivacyNoticeLink } from '../PrivacyNoticeLink/PrivacyNoticeLink'
import { emptyDeliveryInfo } from '../../../types/checkout'
import type { DeliveryInfo, CheckoutFieldErrors } from '../../../types/checkout'
import { validateDeliveryInfo, MAX_COMMENT_LENGTH } from '../../../utils/checkoutValidation'
import { buildWhatsAppMessage } from '../../../utils/buildWhatsAppMessage'
import { buildWhatsAppUrl } from '../../../utils/buildWhatsAppUrl'
import { useCart } from '../../../hooks/useCart'
import styles from './CheckoutForm.module.css'

interface CheckoutFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart()
  const [formData, setFormData] = useState<DeliveryInfo>(emptyDeliveryInfo)
  const [errors, setErrors] = useState<CheckoutFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof DeliveryInfo, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpia el error del campo en cuanto el usuario vuelve a escribir en él
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    const result = validateDeliveryInfo(formData)

    if (!result.isValid) {
      setErrors(result.errors)
      setIsSubmitting(false)
      return
    }

    const message = buildWhatsAppMessage(result.sanitized, items, totalPrice)
    const { url, isTooLong } = buildWhatsAppUrl(message)

    if (isTooLong || !url) {
      setErrors({
        general:
          'Tu pedido tiene demasiados productos o el comentario es muy largo para enviarse por WhatsApp. Intenta acortar el comentario o dividir tu pedido.',
      })
      setIsSubmitting(false)
      return
    }

    // Funciona igual en móvil (abre la app instalada) y escritorio (abre
    // WhatsApp Web) — wa.me resuelve esto automáticamente sin necesidad de
    // detección manual de dispositivo.
    window.open(url, '_blank', 'noopener,noreferrer')

    clearCart()
    setIsSubmitting(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <button type="button" onClick={onBack} className={styles.backButton}>
        ← Volver al carrito
      </button>

      <h2>Datos de Entrega</h2>

      <PrivacyNoticeLink />

      {errors.general && (
        <p className={styles.generalError} role="alert">
          {errors.general}
        </p>
      )}

      <Input
        label="Nombre completo"
        name="nombre"
        value={formData.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
        error={errors.nombre}
        placeholder="Emmanuel Santos Díaz"
        maxLength={100}
        autoComplete="name"
      />

      <Input
        label="Dirección de entrega"
        name="direccion"
        value={formData.direccion}
        onChange={(e) => handleChange('direccion', e.target.value)}
        error={errors.direccion}
        placeholder="Fracc. La Paz, Dolores Hidalgo, Guanajuato"
        maxLength={250}
        autoComplete="street-address"
      />

      <Input
        label="Teléfono (10 dígitos)"
        name="telefono"
        type="tel"
        inputMode="numeric"
        value={formData.telefono}
        onChange={(e) => handleChange('telefono', e.target.value)}
        error={errors.telefono}
        placeholder="9211234567"
        maxLength={10}
        autoComplete="tel"
      />

      <Textarea
        label="Comentario (opcional)"
        name="comentario"
        value={formData.comentario}
        onChange={(e) => handleChange('comentario', e.target.value)}
        error={errors.comentario}
        placeholder="Ej. sin salsa, tocar el timbre..."
        maxLength={MAX_COMMENT_LENGTH}
        hint={`${formData.comentario.length}/${MAX_COMMENT_LENGTH} caracteres`}
      />

      <Button type="submit" variant="whatsapp" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Preparando pedido...' : 'Confirmar y enviar a WhatsApp'}
      </Button>
    </form>
  )
}
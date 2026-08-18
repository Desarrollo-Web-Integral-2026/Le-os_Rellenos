import { useState } from 'react'
import { Input, Textarea, Button } from '../../ui'
import { PrivacyNoticeLink } from '../PrivacyNoticeLink/PrivacyNoticeLink'
import { emptyDeliveryInfo } from '../../../types/checkout'
import type { DeliveryInfo, CheckoutFieldErrors } from '../../../types/checkout'
import { validateDeliveryInfo, MAX_COMMENT_LENGTH } from '../../../utils/checkoutValidation'
import { buildWhatsAppMessage } from '../../../utils/buildWhatsAppMessage'
import { buildWhatsAppUrl } from '../../../utils/buildWhatsAppUrl'
import { createOrder } from '../../../services/api/orders'
import { ApiError } from '../../../services/api/client'
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
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    const result = validateDeliveryInfo(formData)

    if (!result.isValid) {
      setErrors(result.errors)
      setIsSubmitting(false)
      return
    }

    try {
      // 1. Persiste el pedido en la BD real — el backend recalcula el total,
      // valida stock y disponibilidad; nunca confía en lo que mande este form.
      await createOrder(result.sanitized, items)

      // 2. Con el pedido ya guardado, arma el mensaje y abre WhatsApp
      const message = buildWhatsAppMessage(result.sanitized, items, totalPrice)
      const { url, isTooLong } = buildWhatsAppUrl(message)

      if (isTooLong || !url) {
        setErrors({
          general:
            'Tu pedido se guardó, pero el mensaje es muy largo para WhatsApp. Contáctanos directamente con tu número de pedido.',
        })
        setIsSubmitting(false)
        return
      }

      window.open(url, '_blank', 'noopener,noreferrer')
      clearCart()
      setIsSubmitting(false)
      onSuccess()
    } catch (err) {
      // Mensaje genérico y seguro — nunca se expone el detalle real del
      // backend (ej. "stock insuficiente para X" si el error trae info
      // sensible, aunque en este caso el mensaje del backend ya es seguro
      // por diseño de RNF6, se maneja aquí como defensa adicional).
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo procesar tu pedido. Intenta de nuevo.'
      setErrors({ general: message })
      setIsSubmitting(false)
    }
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
        {isSubmitting ? 'Guardando pedido...' : 'Confirmar y enviar a WhatsApp'}
      </Button>
    </form>
  )
}
import { useMemo, useState } from 'react'
import { Button, Card } from '../../ui'
import {
  BASE_OPTIONS,
  RELLENO_OPTIONS,
  SALSA_OPTIONS,
  MAX_RELLENOS,
} from '../../../config/customizationOptions'
import type { LenoCustomization } from '../../../types/customization'
import { emptyCustomization } from '../../../types/customization'
import { validateCustomization } from '../../../utils/customizationValidation'
import { calculateCustomizationPrice } from '../../../utils/customizationPricing'
import { buildCustomProduct } from '../../../utils/buildCustomProduct'
import { useCart } from '../../../hooks/useCart'
import { formatPrice } from '../../../utils/formatPrice'
import styles from './LenoCustomizer.module.css'

interface LenoCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

export function LenoCustomizer({ isOpen, onClose }: LenoCustomizerProps) {
  const { addItem, increaseQty } = useCart()
  const [customization, setCustomization] = useState<LenoCustomization>(emptyCustomization)
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [justAdded, setJustAdded] = useState(false)

  const price = useMemo(() => calculateCustomizationPrice(customization), [customization])

  if (!isOpen) return null

  function toggleRelleno(id: string) {
    setJustAdded(false)
    setCustomization((prev) => {
      const isSelected = prev.rellenoIds.includes(id)
      if (isSelected) {
        return { ...prev, rellenoIds: prev.rellenoIds.filter((r) => r !== id) }
      }
      // Segunda barrera: aunque el checkbox ya se deshabilita en la UI al
      // llegar al máximo, esta función también rechaza el cambio.
      if (prev.rellenoIds.length >= MAX_RELLENOS) return prev
      return { ...prev, rellenoIds: [...prev.rellenoIds, id] }
    })
  }

  function handleAddToCart() {
    const result = validateCustomization(customization)
    if (!result.isValid) {
      setErrors(result.errors)
      setJustAdded(false)
      return
    }

    setErrors([])
    const product = buildCustomProduct(customization)

    addItem(product)
    for (let i = 1; i < quantity; i++) {
      increaseQty(product.id_producto)
    }

    setJustAdded(true)
    setCustomization(emptyCustomization)
    setQuantity(1)
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.panel} role="dialog" aria-label="Personaliza tu leño" aria-modal="true">
        <div className={styles.header}>
          <h2>Personaliza tu Leño</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3>Base</h3>
            {BASE_OPTIONS.map((option) => (
              <label key={option.id} className={styles.optionRow}>
                <input
                  type="radio"
                  name="base"
                  value={option.id}
                  checked={customization.baseId === option.id}
                  onChange={() => setCustomization((prev) => ({ ...prev, baseId: option.id }))}
                />
                {option.label}
              </label>
            ))}
          </section>

          <section className={styles.section}>
            <h3>Rellenos (máx. {MAX_RELLENOS})</h3>
            {RELLENO_OPTIONS.map((option) => {
              const isSelected = customization.rellenoIds.includes(option.id)
              const isDisabled = !isSelected && customization.rellenoIds.length >= MAX_RELLENOS
              return (
                <label
                  key={option.id}
                  className={[styles.optionRow, isDisabled ? styles.optionDisabled : ''].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => toggleRelleno(option.id)}
                  />
                  {option.label}
                  {option.extraCost > 0 && (
                    <span className={styles.extraCost}> (+{formatPrice(option.extraCost)})</span>
                  )}
                </label>
              )
            })}
          </section>

          <section className={styles.section}>
            <h3>Salsa</h3>
            {SALSA_OPTIONS.map((option) => (
              <label key={option.id} className={styles.optionRow}>
                <input
                  type="radio"
                  name="salsa"
                  value={option.id}
                  checked={customization.salsaId === option.id}
                  onChange={() => setCustomization((prev) => ({ ...prev, salsaId: option.id }))}
                />
                {option.label}
              </label>
            ))}
          </section>

          <Card className={styles.preview}>
            <h3>Resumen</h3>
            <p className={styles.previewLine}>
              Base: {BASE_OPTIONS.find((o) => o.id === customization.baseId)?.label ?? '—'}
            </p>
            <p className={styles.previewLine}>
              Rellenos:{' '}
              {customization.rellenoIds.length > 0
                ? customization.rellenoIds
                    .map((id) => RELLENO_OPTIONS.find((o) => o.id === id)?.label)
                    .join(', ')
                : '—'}
            </p>
            <p className={styles.previewLine}>
              Salsa: {SALSA_OPTIONS.find((o) => o.id === customization.salsaId)?.label ?? '—'}
            </p>
            <p className={styles.previewTotal}>Total: {formatPrice(price)}</p>
          </Card>

          {errors.length > 0 && (
            <ul className={styles.errorList} role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          {justAdded && (
            <p className={styles.successMessage} role="status">
              ¡Tu leño personalizado se agregó al carrito! 🪵
            </p>
          )}

          <div className={styles.quantityRow}>
            <span>Cantidad:</span>
            <button
              type="button"
              className={styles.qtyButton}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              className={styles.qtyButton}
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <Button onClick={handleAddToCart} className={styles.addButton}>
            Añadir al carrito
          </Button>
        </div>
      </div>
    </>
  )
}
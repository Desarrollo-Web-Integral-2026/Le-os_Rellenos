import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...rest }, ref) => {
    const textareaId = id ?? rest.name

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={[styles.textarea, error ? styles.textareaError : '', className]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...rest}
        />
        {hint && !error && <span className={styles.hint}>{hint}</span>}
        {error && (
          <span id={`${textareaId}-error`} role="alert" className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
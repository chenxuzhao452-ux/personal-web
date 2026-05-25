'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'motion/react';
import { FormField } from './FormField';
import { contactSchema, type ContactInput } from '../validation';
import { submitContact } from '../actions';
import { useState, useCallback, useRef } from 'react';
import { useTranslation } from '@/components/LanguageProvider';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

export function ContactForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = useCallback(async (data: ContactInput) => {
    setStatus('idle');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    for (const f of files) {
      formData.append('attachment', f);
    }

    const result = await submitContact(formData);

    if (result.success) {
      setStatus('success');
      setFiles([]);
      if (fileRef.current) fileRef.current.value = '';
      reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong.');
    }
  }, [files, reset]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const oversized = selected.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setErrorMessage(`"${oversized.name}" exceeds 10 MB size limit.`);
      setStatus('error');
      return;
    }

    if (files.length + selected.length > MAX_FILES) {
      setErrorMessage(`You can attach up to ${MAX_FILES} files.`);
      setStatus('error');
      return;
    }

    setFiles((prev) => [...prev, ...selected]);
    setStatus('idle');
    setErrorMessage('');
  }, [files.length]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  return (
    <m.div
      className="contact-form-wrapper"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mono-label">{t('contact.title' as any)}</span>
      <h2 className="heading-2" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {t('contact.heading' as any)}
      </h2>

      {status === 'success' ? (
        <div className="contact-form__success" role="status">
          <p className="body-large">{t('contact.success' as any)}</p>
          <button
            type="button"
            className="contact-form__submit"
            onClick={() => setStatus('idle')}
            style={{ marginTop: 'var(--space-5)' }}
          >
            {t('contact.sendAnother' as any)}
            <span className="contact-form__submit-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
          <FormField
            label={t('contact.name' as any)}
            name="name"
            required
            placeholder={t('contact.namePlaceholder' as any)}
            error={errors.name?.message}
            registration={register('name')}
          />
          <FormField
            label={t('contact.emailLabel' as any)}
            name="email"
            type="email"
            required
            placeholder={t('contact.emailPlaceholder' as any)}
            error={errors.email?.message}
            registration={register('email')}
          />
          <FormField
            label={t('contact.subject' as any)}
            name="subject"
            required
            placeholder={t('contact.subjectPlaceholder' as any)}
            error={errors.subject?.message}
            registration={register('subject')}
          />
          <FormField
            label={t('contact.message' as any)}
            name="message"
            type="textarea"
            required
            placeholder={t('contact.messagePlaceholder' as any)}
            error={errors.message?.message}
            registration={register('message')}
          />

          <div className="form-field">
            <label className="form-field__label mono-label">
              {t('contact.attachment' as any)}
              <span className="form-field__optional"> {t('contact.attachmentOptional' as any)}</span>
            </label>
            <div className="attachment-row">
              <label className="attachment__btn">
                {t('contact.attachment' as any)}
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="attachment__input"
                  onChange={handleFileChange}
                  aria-describedby="attachment-hint"
                />
              </label>
              {files.length > 0 ? (
                <ul className="attachment__list">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="attachment__item">
                      <span className="attachment__name">{f.name}</span>
                      <button
                        type="button"
                        className="attachment__remove"
                        onClick={() => handleRemoveFile(i)}
                        aria-label={`Remove ${f.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span id="attachment-hint" className="attachment__hint">
                  {t('contact.attachmentHint' as any)}
                </span>
              )}
            </div>
          </div>

          {status === 'error' && (
            <p className="contact-form__error" role="alert">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="contact-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('contact.sending' as any) : t('contact.submit' as any)}
            <span className="contact-form__submit-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </form>
      )}

      <style jsx>{`
        .contact-form-wrapper {
          max-width: 640px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .contact-form__success {
          padding: var(--space-8) 0;
        }

        .contact-form__submit {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          background: var(--color-accent);
          color: #fff;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          letter-spacing: 0.04em;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: box-shadow var(--duration-fast) var(--ease-out),
                      opacity var(--duration-fast) var(--ease-out);
        }

        .contact-form__submit:hover:not(:disabled) {
          box-shadow: var(--shadow-glow-lg);
        }

        .contact-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contact-form__submit-arrow {
          transition: transform var(--duration-fast) var(--ease-out);
        }

        .contact-form__submit:hover:not(:disabled) .contact-form__submit-arrow {
          transform: translateX(4px);
        }

        .contact-form__error {
          font-size: var(--text-sm);
          color: var(--color-error);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-field__label {
          color: var(--color-text-secondary);
        }

        .form-field__optional {
          color: var(--color-text-tertiary);
          font-weight: 400;
        }

        .attachment-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .attachment__btn {
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          background: rgba(26, 26, 38, 0.6);
          border: var(--border-thin);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: border-color var(--duration-fast) var(--ease-out),
                      color var(--duration-fast) var(--ease-out);
          white-space: nowrap;
        }

        .attachment__btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .attachment__input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }

        .attachment__list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .attachment__item {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-1) var(--space-3);
          background: rgba(108, 92, 231, 0.08);
          border: 1px solid rgba(108, 92, 231, 0.15);
          border-radius: var(--radius-sm);
        }

        .attachment__name {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          font-family: var(--font-mono);
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .attachment__remove {
          background: none;
          border: none;
          color: var(--color-text-tertiary);
          cursor: pointer;
          font-size: var(--text-lg);
          line-height: 1;
          padding: 0;
          flex-shrink: 0;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .attachment__remove:hover {
          color: var(--color-error);
        }

        .attachment__hint {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }
      `}</style>
    </m.div>
  );
}

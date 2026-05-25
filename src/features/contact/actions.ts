'use server';

import { ZodError } from 'zod';
import { contactSchema } from './validation';
import { sendContactEmail } from '@/lib/email/send';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function submitContact(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    const validated = contactSchema.parse(data);

    const fileList = formData.getAll('attachment') as File[];
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];

    for (const file of fileList) {
      if (file.size > 0) {
        if (file.size > MAX_FILE_SIZE) {
          return { success: false, error: `"${file.name}" exceeds 10 MB size limit.` };
        }
        const bytes = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(bytes),
          contentType: file.type,
        });
      }
    }

    return await sendContactEmail({
      ...validated,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Validation failed. Please check your inputs.' };
    }
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return { success: false, error: message };
  }
}

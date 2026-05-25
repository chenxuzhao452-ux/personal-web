import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const TO = 'chenxuzhao452@gmail.com';

interface AttachmentInput {
  filename: string;
  content: Buffer;
  contentType: string;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments?: AttachmentInput[];
}): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'Email service not configured.' };
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[Contact] ${data.subject}`,
      replyTo: data.email,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      attachments: data.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send email.';
    return { success: false, error: message };
  }
}

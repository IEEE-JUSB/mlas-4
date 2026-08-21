import { Resend } from 'resend';
import toWords from 'number-to-words';
import { generateReceiptImage } from './canvas-receipt';

interface SendReceiptEmailParams {
  email: string;
  userName: string;
  paymentId: string;
  amount: number;
  membershipType: string;
  whatsappGroupLink: string;
  paymentDate?: string;
  paymentMethod?: string;
  bankName?: string;
  firmName?: string;
}

// Helper function to convert amount to words using number-to-words library
function convertAmountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = '';

  if (rupees > 0) {
    const rupeesWords = toWords.toWords(rupees);
    // Capitalize first letter
    result = rupeesWords.charAt(0).toUpperCase() + rupeesWords.slice(1);
    result += ' Rupees';
  }

  if (paise > 0) {
    if (result) {
      result += ' and ';
    }
    const paiseWords = toWords.toWords(paise);
    result += paiseWords.charAt(0).toUpperCase() + paiseWords.slice(1);
    result += ' Paise';
  }

  if (result) {
    result += ' Only';
  }

  return result;
}

export async function sendReceiptEmail({
  email,
  userName,
  paymentId,
  amount,
  membershipType,
  whatsappGroupLink,
  paymentDate,
  paymentMethod = 'UPI',
  bankName = 'Razorpay',
  firmName = 'IEEE Student Branch',
}: SendReceiptEmailParams): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const amountInRupees = amount / 100; // Convert from paise to rupees
  const membershipLabel = membershipType === 'ieee' ? 'IEEE Member' : 'Non-IEEE Member';
  const currentDate =
    paymentDate ||
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const amountInWords = convertAmountToWords(amountInRupees);
  const paymentAccount = `MLAS-4 Registration (${membershipLabel})`;
  const amountInRupeesFormatted = `₹${amountInRupees}`;

  // Generate receipt image using canvas
  const receiptBuffer = await generateReceiptImage({
    firmName,
    receiptNo: paymentId,
    date: currentDate,
    userName,
    amountInWords,
    paymentMethod,
    bankName,
    paymentAccount,
    amountInRupees: amountInRupeesFormatted,
  });

  // Convert buffer to base64 for email embedding
  const receiptBase64 = receiptBuffer.toString('base64');
  const receiptDataUrl = `data:image/png;base64,${receiptBase64}`;

  const mailOptions = {
    from: process.env.RESEND_FROM_EMAIL || (process.env.RESEND_API_KEY ? 'onboarding@resend.dev' : 'noreply@example.com'),
    to: email,
    subject: 'Payment Receipt - Workshop Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
        
        <!-- Email Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0;">Payment Receipt - Workshop Registration</h2>
          <p style="margin: 10px 0;">Dear ${userName},</p>
          <p style="margin: 0;">Thank you for your payment! Your registration has been successfully completed.</p>
        </div>

        <!-- Receipt Image -->
        <div style="text-align: center; margin: 20px 0;">
          <img src="${receiptDataUrl}" alt="Payment Receipt" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>

        <!-- WhatsApp Group Link -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0;">WhatsApp Group Link:</h3>
          <p style="margin: 0;">Join our workshop WhatsApp group using this link:</p>
          <p style="margin: 10px 0;">
            <a href="${whatsappGroupLink}" style="color: #0066cc; text-decoration: underline;">${whatsappGroupLink}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">If you have any questions, feel free to reach out.</p>
          <p style="margin: 5px 0;">Best regards,<br>Workshop Team</p>
        </div>
      </div>
    `,
  };

  const { data, error } = await resend.emails.send(mailOptions);

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log('Email sent:', data.id);
}

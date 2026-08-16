import nodemailer from 'nodemailer';
import toWords from 'number-to-words';

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
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const amountInRupees = amount / 100; // Convert from paise to rupees
  const membershipLabel = membershipType === 'ieee' ? 'IEEE Member' : 'Non-IEEE Member';
  const currentDate =
    paymentDate ||
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const amountInWords = convertAmountToWords(amountInRupees);
  const paymentAccount = `MLAS-4 Registration (${membershipLabel})`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

        <!-- Money Receipt Design -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <!-- Left Receipt -->
            <td style="width: 50%; padding: 0; border: 2px solid #000; vertical-align: top;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 15px;">
                    <!-- IEEE Logo -->
                    <div style="text-align: left; margin-bottom: 10px;">
                      <img src="/ieee_logo_black_on_white.png" alt="IEEE Logo" style="height: 60px;">
                    </div>
                    
                    <!-- Money Receipt Header -->
                    <div style="text-align: center; margin: 15px 0;">
                      <h3 style="margin: 0; font-size: 24px; font-weight: bold;">Money</h3>
                      <h3 style="margin: 0; font-size: 24px; font-weight: bold;">Receipt</h3>
                    </div>

                    <!-- Receipt Details -->
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Firm's Name:</td>
                        <td style="padding: 5px; font-size: 14px;">${firmName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Receipt No.:</td>
                        <td style="padding: 5px; font-size: 14px;">${paymentId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Dated:</td>
                        <td style="padding: 5px; font-size: 14px; border-bottom: 1px solid #000; width: 100px;">${currentDate}</td>
                      </tr>
                    </table>

                    <!-- Main Receipt Box -->
                    <div style="border: 2px solid #000; margin-top: 20px; padding: 15px;">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 5px; font-weight: bold; font-size: 14px;">RECEIVED</td>
                          <td style="padding: 5px; font-size: 14px;">with thanks from Mr/s</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 150px;">${userName}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">The sum of Rupees</td>
                          <td colspan="2" style="padding: 5px; border-bottom: 1px solid #000;">${amountInWords}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">By Cash/Cheque/UPI</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 80px;">${paymentMethod}</td>
                          <td style="padding: 5px; font-size: 14px;">Dated</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 80px;">${currentDate}</td>
                        </tr>
                        <tr>
                          <td colspan="4" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">drawn on</td>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;">${bankName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">Payment on A/c of</td>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;">${paymentAccount}</td>
                        </tr>
                      </table>

                      <!-- Rs Box -->
                      <div style="border: 2px solid #000; margin-top: 15px; padding: 5px; display: inline-block;">
                        <span style="font-weight: bold; font-size: 14px;">Rs:</span>
                        <span style="font-size: 14px; margin-left: 5px;">₹${amountInRupees}</span>
                      </div>
                    </div>

                    <!-- Signatures -->
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                      <tr>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Treasurer</div>
                          <div>Signature</div>
                        </td>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Chairperson</div>
                          <div>Signature</div>
                        </td>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Secretary</div>
                          <div>Signature</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>

            <!-- Dotted Cut Line -->
            <td style="width: 4px; border-left: 3px dashed #000; border-right: 3px dashed #000;"></td>

            <!-- Right Receipt (Duplicate) -->
            <td style="width: 50%; padding: 0; border: 2px solid #000; vertical-align: top;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 15px;">
                    <!-- IEEE Logo -->
                    <div style="text-align: left; margin-bottom: 10px;">
                      <img src="/ieee_logo_black_on_white.png" alt="IEEE Logo" style="height: 60px;">
                    </div>
                    
                    <!-- Money Receipt Header -->
                    <div style="text-align: center; margin: 15px 0;">
                      <h3 style="margin: 0; font-size: 24px; font-weight: bold;">Money</h3>
                      <h3 style="margin: 0; font-size: 24px; font-weight: bold;">Receipt</h3>
                      <p style="margin: 5px 0; font-size: 12px; color: #666;">(Duplicate)</p>
                    </div>

                    <!-- Receipt Details -->
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Firm's Name:</td>
                        <td style="padding: 5px; font-size: 14px;">${firmName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Receipt No.:</td>
                        <td style="padding: 5px; font-size: 14px;">${paymentId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px; font-weight: bold; font-size: 14px;">Dated:</td>
                        <td style="padding: 5px; font-size: 14px; border-bottom: 1px solid #000; width: 100px;">${currentDate}</td>
                      </tr>
                    </table>

                    <!-- Main Receipt Box -->
                    <div style="border: 2px solid #000; margin-top: 20px; padding: 15px;">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 5px; font-weight: bold; font-size: 14px;">RECEIVED</td>
                          <td style="padding: 5px; font-size: 14px;">with thanks from Mr/s</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 150px;">${userName}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">The sum of Rupees</td>
                          <td colspan="2" style="padding: 5px; border-bottom: 1px solid #000;">${amountInWords}</td>
                        </tr>
                        <tr>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">By Cash/Cheque/UPI</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 80px;">${paymentMethod}</td>
                          <td style="padding: 5px; font-size: 14px;">Dated</td>
                          <td style="padding: 5px; border-bottom: 1px solid #000; width: 80px;">${currentDate}</td>
                        </tr>
                        <tr>
                          <td colspan="4" style="padding: 5px; border-bottom: 1px solid #000;"></td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">drawn on</td>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;">${bankName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 5px; font-size: 14px;">Payment on A/c of</td>
                          <td colspan="3" style="padding: 5px; border-bottom: 1px solid #000;">${paymentAccount}</td>
                        </tr>
                      </table>

                      <!-- Rs Box -->
                      <div style="border: 2px solid #000; margin-top: 15px; padding: 5px; display: inline-block;">
                        <span style="font-weight: bold; font-size: 14px;">Rs:</span>
                        <span style="font-size: 14px; margin-left: 5px;">₹${amountInRupees}</span>
                      </div>
                    </div>

                    <!-- Signatures -->
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                      <tr>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Treasurer</div>
                          <div>Signature</div>
                        </td>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Chairperson</div>
                          <div>Signature</div>
                        </td>
                        <td style="width: 33%; text-align: center; font-size: 12px;">
                          <div>Secretary</div>
                          <div>Signature</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

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

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
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

import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'path';

// ============================================================
// CANVAS CONFIG
// ============================================================

const W = 1133;
const H = 450;
const PANEL_W = 566;

const BLACK = '#000000';
const WHITE = '#ffffff';

// ============================================================
// HELPERS
// ============================================================

function font(size: number, bold = false) {
  return `${bold ? 'bold ' : ''}${size}px Arial`;
}

function line(
  ctx: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width = 2
) {
  ctx.strokeStyle = BLACK;
  ctx.lineWidth = width;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ============================================================
// DRAW LOGO
// ============================================================

async function drawLogo(ctx: any, x: number, y: number, logoPath: string) {
  const logo = await loadImage(logoPath);

  /*
   * Original logo:
   * 640 x 640
   *
   * Crop out the large white margins.
   */
  ctx.drawImage(logo, 40, 159, 579, 281, x, y, 130, 63);
}

// ============================================================
// DRAW ONE RECEIPT
// ============================================================

interface ReceiptData {
  firmName: string;
  receiptNo: string;
  date: string;
  userName: string;
  amountInWords: string;
  paymentMethod: string;
  bankName: string;
  paymentAccount: string;
  amountInRupees: string;
}

async function drawPanel(ctx: any, ox: number, data: ReceiptData, logoPath: string) {
  // Everything in the receipt is pure black.
  ctx.fillStyle = BLACK;
  ctx.strokeStyle = BLACK;

  // ==========================================================
  // OUTER BORDER
  // ==========================================================

  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, 1, 564, 448);

  // ==========================================================
  // IEEE LOGO
  // ==========================================================

  await drawLogo(ctx, ox + 41, 18, logoPath);

  // ==========================================================
  // MONEY RECEIPT
  // ==========================================================

  ctx.fillStyle = BLACK;
  ctx.font = font(33, true);
  ctx.fillText('Money', ox + 228, 56);
  ctx.fillText('Receipt', ox + 220, 92);

  // ==========================================================
  // HEADER
  // ==========================================================

  // Firm's Name - BOLD
  ctx.font = font(16, true);
  ctx.fillText("Firm's Name:", ox + 53, 132);

  // Receipt No. - BOLD
  ctx.font = font(14, true);
  ctx.fillText('Receipt No. :', ox + 337, 124);

  // Dated - BOLD
  ctx.fillText('Dated:', ox + 340, 153);

  // Date underline
  line(ctx, ox + 385, 156, ox + 499, 156, 1.8);

  // ==========================================================
  // MAIN RECEIPT BOX
  // ==========================================================

  const bx = ox + 53;
  const by = 170;
  const bw = 470;
  const bh = 213;

  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // ==========================================================
  // RECEIVED WITH THANKS FROM MR/S
  // ==========================================================

  // RECEIVED - BOLD
  ctx.fillStyle = BLACK;
  ctx.font = font(14, true);
  ctx.fillText('RECEIVED', bx + 15, 193);

  const receivedWidth = ctx.measureText('RECEIVED').width;

  // Rest of sentence - NORMAL
  ctx.font = font(14, false);
  const receivedTextX = bx + 15 + receivedWidth;
  const thanksText = ' with thanks from Mr/s';
  ctx.fillText(thanksText, receivedTextX, 193);

  // Underline continues on SAME ROW after "Mr/s".
  const thanksWidth = ctx.measureText(thanksText).width;
  line(ctx, receivedTextX + thanksWidth + 6, 199, bx + bw - 10, 199, 1.8);

  // Separate horizontal line underneath.
  line(ctx, bx + 15, 224, bx + bw - 10, 224, 1.8);

  // ==========================================================
  // THE SUM OF RUPEES
  // ==========================================================

  ctx.font = font(14, false);
  ctx.fillText('The sum of Rupees', bx + 15, 243);

  // Amount writing line
  line(ctx, bx + 148, 249, bx + bw - 10, 249, 1.8);

  // Full line underneath
  line(ctx, bx + 15, 274, bx + bw - 10, 274, 1.8);

  // ==========================================================
  // CASH / CHEQUE / UPI + DATED
  // ==========================================================

  ctx.font = font(14, false);
  ctx.fillText('By Cash/Cheque/UPI', bx + 15, 293);

  // Payment method writing line
  line(ctx, bx + 175, 299, bx + 302, 299, 1.8);

  ctx.fillText('Dated', bx + 310, 293);

  // Date writing line
  line(ctx, bx + 353, 299, bx + bw - 10, 299, 1.8);

  // IMPORTANT: Full horizontal separator AFTER Cash/Cheque/UPI + Dated row.
  line(ctx, bx + 15, 324, bx + bw - 10, 324, 1.8);

  // ==========================================================
  // DRAWN ON
  // ==========================================================

  ctx.font = font(14, false);
  ctx.fillText('drawn on', bx + 15, 343);

  // Drawn-on writing line
  line(ctx, bx + 73, 349, bx + 316, 349, 1.8);

  ctx.fillText('In Part/Full/Balance', bx + 325, 343);

  // ==========================================================
  // PAYMENT ON A/C OF
  // ==========================================================

  ctx.fillText('Payment on A/c of', bx + 15, 368);

  // Payment writing line
  line(ctx, bx + 143, 374, bx + bw - 10, 374, 1.8);

  // ==========================================================
  // RS BOX
  // ==========================================================

  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(ox + 53, 398, 156, 32);

  ctx.fillStyle = BLACK;
  ctx.font = font(14, false);
  ctx.fillText('Rs:', ox + 62, 420);

  // ==========================================================
  // SIGNATURES
  // ==========================================================

  ctx.fillStyle = BLACK;
  ctx.font = font(10, false);
  ctx.textAlign = 'center';

  ctx.fillText('Treasurer', ox + 336, 422);
  ctx.fillText('Signature', ox + 336, 436);

  ctx.fillText('Chairperson', ox + 473, 422);
  ctx.fillText('Signature', ox + 473, 436);

  // Reset alignment for next receipt.
  ctx.textAlign = 'left';

  // ==========================================================
  // FILL DYNAMIC DATA
  // ==========================================================

  // Firm's Name value
  ctx.font = font(14, false);
  ctx.fillText(data.firmName, ox + 155, 132);

  // Receipt No. value
  ctx.fillText(data.receiptNo, ox + 410, 124);

  // Date value
  ctx.fillText(data.date, ox + 385, 153);

  // User name
  ctx.fillText(data.userName, bx + 15, 193);
  const userNameWidth = ctx.measureText(data.userName).width;
  line(ctx, bx + 15 + userNameWidth + 6, 199, bx + bw - 10, 199, 1.8);

  // Amount in words
  ctx.fillText(data.amountInWords, bx + 148, 243);
  const amountWordsWidth = ctx.measureText(data.amountInWords).width;
  line(ctx, bx + 148 + amountWordsWidth + 6, 249, bx + bw - 10, 249, 1.8);

  // Payment method
  ctx.fillText(data.paymentMethod, bx + 175, 293);
  const paymentMethodWidth = ctx.measureText(data.paymentMethod).width;
  line(ctx, bx + 175 + paymentMethodWidth + 6, 299, bx + 302, 299, 1.8);

  // Date again
  ctx.fillText(data.date, bx + 353, 293);
  const dateWidth = ctx.measureText(data.date).width;
  line(ctx, bx + 353 + dateWidth + 6, 299, bx + bw - 10, 299, 1.8);

  // Bank name
  ctx.fillText(data.bankName, bx + 73, 343);
  const bankNameWidth = ctx.measureText(data.bankName).width;
  line(ctx, bx + 73 + bankNameWidth + 6, 349, bx + 316, 349, 1.8);

  // Payment account
  ctx.fillText(data.paymentAccount, bx + 143, 368);
  const paymentAccountWidth = ctx.measureText(data.paymentAccount).width;
  line(ctx, bx + 143 + paymentAccountWidth + 6, 374, bx + bw - 10, 374, 1.8);

  // Amount in rupees
  ctx.fillText(data.amountInRupees, ox + 90, 420);
}

// ============================================================
// GENERATE RECEIPT IMAGE
// ============================================================

export async function generateReceiptImage(data: ReceiptData): Promise<Buffer> {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.imageSmoothingEnabled = true;

  // Get logo path
  const logoPath = join(process.cwd(), 'public', 'ieee_logo_black_on_white.png');

  // Draw left receipt
  await drawPanel(ctx, 0, data, logoPath);

  // Draw right receipt (duplicate)
  await drawPanel(ctx, PANEL_W + 1, data, logoPath);

  // Centre dotted cut line
  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 5]);
  line(ctx, 566, 12, 566, 441, 3);
  ctx.setLineDash([]);

  // Add "(Duplicate)" text to right receipt
  ctx.fillStyle = '#666666';
  ctx.font = font(12, false);
  ctx.textAlign = 'center';
  ctx.fillText('(Duplicate)', PANEL_W + 1 + 283, 120);
  ctx.textAlign = 'left';

  return canvas.toBuffer('image/png');
}

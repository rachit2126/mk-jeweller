import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function buildHeroBanner() {
  const masterJhumka = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961981637.jpg';
  
  // Dimensions for high-end desktop hero
  const targetW = 1920;
  const targetH = 840;

  // Let's inspect master dimensions
  const meta = await sharp(masterJhumka).metadata();
  console.log('Master jhumka dimensions:', meta.width, 'x', meta.height);

  // We want the jhumka and stone composition positioned on the right (x: ~780 to 1920)
  // And the left side smoothly extending the warm ivory stone and soft drape texture (#F4F1EA / #ECE7DD)
  // Let's first resize masterJhumka so its height covers 840px
  // 1024x1024 -> 840x840 or scaled to 1100x1100
  const rightW = 1100;
  const rightH = 1100;
  
  const resizedRight = await sharp(masterJhumka)
    .resize(rightW, rightH, { fit: 'cover' })
    .toBuffer();

  // Create base canvas with smooth horizontal gradient matching the travertine & linen tone
  // Left: #F7F5EF (warm ivory travertine), Middle: #F3EFE7, Right blends into the photo
  const svgBg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF8F3"/>
          <stop offset="30%" stop-color="#F5F2EB"/>
          <stop offset="55%" stop-color="#EFEAE0"/>
          <stop offset="100%" stop-color="#E8E2D5"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    </svg>
  `;

  // Create a soft horizontal alpha gradient mask to seamlessly blend the left edge of the photo
  const maskSvg = `
    <svg width="${rightW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeMask" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="22%" stop-color="#fff" stop-opacity="0.6"/>
          <stop offset="40%" stop-color="#fff" stop-opacity="1"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#fadeMask)"/>
    </svg>
  `;

  // Crop top/bottom of resized right to 840 height
  const croppedRight = await sharp(resizedRight)
    .extract({ left: 0, top: Math.round((rightH - targetH) / 2), width: rightW, height: targetH })
    .toBuffer();

  // Apply alpha feathering to the left edge of the photo
  // We can composite the croppedRight onto the background at x: targetW - rightW (820)
  // and blend with an overlay
  const outPath = '/Users/apple/mk/mk-silver-hub/public/images/hero/hero-oxidised-silver.jpg';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Composite base background with the positioned photo
  // Also add subtle texture on left
  const blended = await sharp(Buffer.from(svgBg))
    .composite([
      {
        input: croppedRight,
        left: targetW - rightW + 40, // 860
        top: 0,
        blend: 'over',
      }
    ])
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer();

  // Now create a smooth soft gradient overlay on the left to ensure the typography has 100% pure contrast
  const vignetteSvg = `
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textZone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF8F3" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="#FAF8F3" stop-opacity="0.85"/>
          <stop offset="48%" stop-color="#FAF8F3" stop-opacity="0.45"/>
          <stop offset="65%" stop-color="#FAF8F3" stop-opacity="0"/>
          <stop offset="100%" stop-color="#FAF8F3" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#textZone)"/>
    </svg>
  `;

  const finalImg = await sharp(blended)
    .composite([
      {
        input: Buffer.from(vignetteSvg),
        left: 0,
        top: 0,
      }
    ])
    .sharpen({ sigma: 1.0 })
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(outPath, finalImg);
  console.log('✓ Successfully created hero banner at:', outPath);

  // Also create a mobile-optimized portrait version (800x900)
  const mobilePath = '/Users/apple/mk/mk-silver-hub/public/images/hero/hero-oxidised-silver-mobile.jpg';
  const mobileImg = await sharp(masterJhumka)
    .resize(800, 900, { fit: 'cover', position: 'center' })
    .sharpen()
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(mobilePath, mobileImg);
  console.log('✓ Successfully created mobile hero image at:', mobilePath);
}

buildHeroBanner().catch(console.error);

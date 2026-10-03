import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAll8Images() {
  const banner = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790962257138.png';
  
  const masterFiles = {
    earrings: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961981637.jpg',
    necklaces: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961985816.jpg',
    rings: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961989741.jpg',
    bracelets: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790962008796.jpg',
  };

  const bannerCrops = {
    bangles: { left: 576, top: 146, width: 96, height: 134 },
    anklets: { left: 714, top: 146, width: 78, height: 132 },
    pendants: { left: 824, top: 142, width: 62, height: 132 },
    mangalsutra: { left: 908, top: 142, width: 46, height: 120 },
  };

  const targetDirs = [
    '/Users/apple/mk/mk-silver-hub/public/images/category',
    '/Users/apple/mk/mk-silver-hub/public/category',
  ];

  for (const dir of targetDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. High-res masters (1-4)
  for (const [slug, srcPath] of Object.entries(masterFiles)) {
    console.log(`Processing high-res master for ${slug}...`);
    const buf = await sharp(srcPath)
      .resize(800, 1000, {
        fit: 'cover',
        position: 'center',
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen()
      .jpeg({ quality: 94, mozjpeg: true })
      .toBuffer();

    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, `${slug}.jpg`), buf);
    }
  }

  // 2. Banner crops (5-8)
  for (const [slug, crop] of Object.entries(bannerCrops)) {
    console.log(`Processing ${slug} from reference banner...`);
    const buf = await sharp(banner)
      .extract(crop)
      .resize(800, 1000, {
        fit: 'cover',
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 1.2, m1: 1.2, m2: 2.2 })
      .jpeg({ quality: 94, mozjpeg: true })
      .toBuffer();

    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, `${slug}.jpg`), buf);
    }
  }

  console.log('✓ All 8 category images freshly regenerated!');
}

generateAll8Images().catch(console.error);

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function extractExactPhotos() {
  const banner = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790962257138.png';
  
  // Master photoshoot files for 1-4 (1024x1024):
  const masterFiles = {
    earrings: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961981637.jpg',
    necklaces: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961985816.jpg',
    rings: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790961989741.jpg',
    bracelets: '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.user_uploaded/media_1790962008796.jpg',
  };

  const bannerCrops = {
    bangles: { left: 542, top: 128, width: 132, height: 184 },
    anklets: { left: 684, top: 136, width: 110, height: 160 },
    pendants: { left: 800, top: 135, width: 85, height: 155 },
    mangalsutra: { left: 888, top: 135, width: 68, height: 145 },
  };

  const targetDirs = [
    '/Users/apple/mk/mk-silver-hub/public/images/category',
    '/Users/apple/mk/mk-silver-hub/public/category',
  ];

  for (const dir of targetDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Process 1-4 from master high-res files (1024x1024 -> resize/crop to 800x1000)
  for (const [slug, srcPath] of Object.entries(masterFiles)) {
    console.log(`Processing high-res master for ${slug}...`);
    const buf = await sharp(srcPath)
      .resize(800, 1000, {
        fit: 'cover',
        position: 'center',
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen()
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, `${slug}.jpg`), buf);
    }
  }

  // 2. Process 5-8 from the banner
  for (const [slug, crop] of Object.entries(bannerCrops)) {
    console.log(`Processing ${slug} from reference banner...`);
    const buf = await sharp(banner)
      .extract(crop)
      .resize(800, 1000, {
        fit: 'cover',
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 1.1, m1: 1.2, m2: 2.2 })
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, `${slug}.jpg`), buf);
    }
  }

  console.log('✓ All 8 category images successfully updated with authentic photoshoot imagery!');
}

extractExactPhotos().catch(console.error);

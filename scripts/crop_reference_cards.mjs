import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function cropCards() {
  const src = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/.tempmediaStorage/media_1790962604617.png';
  const meta = await sharp(src).metadata();
  console.log('Source:', meta.width, 'x', meta.height);

  // The banner has 8 arched cards spread across its width.
  // Let's estimate their bounding boxes on 2348x736:
  // Card 1: Earrings (~x: 100 to 280)
  // Card 2: Necklaces (~x: 290 to 520)
  // Card 3: Rings (~x: 550 to 860)
  // Card 4: Bracelets (~x: 880 to 1210)
  // Card 5: Bangles (~x: 1240 to 1540)
  // Card 6: Anklets (~x: 1560 to 1810)
  // Card 7: Pendants (~x: 1820 to 2030)
  // Card 8: Mangalsutra (~x: 2040 to 2200)

  // In particular, let's extract Card 5 (Bangles), Card 6 (Anklets), Card 7 (Pendants), Card 8 (Mangalsutra)
  // and see what they contain.
  const cards = [
    { name: 'earrings', left: 100, top: 180, width: 180, height: 350 },
    { name: 'necklaces', left: 280, top: 180, width: 250, height: 420 },
    { name: 'rings', left: 550, top: 180, width: 310, height: 440 },
    { name: 'bracelets', left: 880, top: 180, width: 340, height: 440 },
    { name: 'bangles', left: 1240, top: 180, width: 310, height: 440 },
    { name: 'anklets', left: 1560, top: 180, width: 260, height: 420 },
    { name: 'pendants', left: 1830, top: 180, width: 200, height: 380 },
    { name: 'mangalsutra', left: 2035, top: 180, width: 170, height: 340 },
  ];

  const outDir = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7/scratch/crops';
  fs.mkdirSync(outDir, { recursive: true });

  for (const c of cards) {
    const outPath = path.join(outDir, `${c.name}.jpg`);
    await sharp(src)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .resize(800, 1000, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 92 })
      .toFile(outPath);
    console.log(`Cropped ${c.name} -> ${outPath}`);
  }
}

cropCards().catch(console.error);

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongodb';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const db = await connectDB();
    const col = await db.collection('collections').findOne({ slug, status: 'active' });
    if (col) {
      const title = col.seoTitle || `${col.name} | Fine 925 Sterling Jewellery | MK Silver Hub`;
      const description = col.seoDescription || col.description || `Explore ${col.name} curated in hallmark 925 sterling silver.`;
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://mksilverhub.com/collections/${slug}`,
        },
      };
    }
  } catch (err) {
    console.error('Error generating metadata for collection slug:', slug, err);
  }

  const formattedName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedName} | Collections | MK Silver Hub`,
    description: `Explore the ${formattedName} collection in pure 925 sterling silver by MK Silver Hub.`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/shop?collection=${encodeURIComponent(slug)}`);
}

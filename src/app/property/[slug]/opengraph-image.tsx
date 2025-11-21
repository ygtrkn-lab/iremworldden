import { ImageResponse } from 'next/og';
import { findCountryPropertyBySlug } from '@/lib/server-utils';

export const runtime = 'nodejs';
export const alt = 'IREMWORLD Property';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (error) {
    console.warn('Slug decode failed:', error);
  }

  const potentialId = decodedSlug.split('-').pop();
  const property = findCountryPropertyBySlug(decodedSlug, potentialId);

  if (!property) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1 style={{ fontSize: 72, color: 'white', fontWeight: 'bold' }}>
              IREMWORLD
            </h1>
            <p style={{ fontSize: 32, color: 'white', marginTop: 20 }}>
              Real Estate Marketing
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const typeLabel = property.type === 'sale' ? 'SATILIK' : 'KİRALIK';
  const location = [
    property.location?.district,
    property.location?.city,
  ].filter(Boolean).join(', ');

  const price = property.price
    ? `₺${new Intl.NumberFormat('tr-TR').format(property.price)}`
    : 'Fiyat İçin İletişime Geçin';

  const specs = [
    property.specs?.rooms,
    property.specs?.netSize ? `${property.specs.netSize}m²` : null,
  ].filter(Boolean).join(' • ');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: 48, color: '#1e293b', fontWeight: 'bold', margin: 0 }}>
              IREMWORLD
            </h1>
          </div>
          <div
            style={{
              background: '#f07f38',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {typeLabel}
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '24px',
            padding: '60px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: 56,
              color: '#1e293b',
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {property.title}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 32,
              color: '#64748b',
              marginBottom: '32px',
            }}
          >
            📍 {location}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 48, color: '#f07f38', fontWeight: 'bold' }}>
              {price}
            </div>
            <div style={{ fontSize: 28, color: '#64748b' }}>
              {specs}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '40px',
            fontSize: 24,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          www.iremworld.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

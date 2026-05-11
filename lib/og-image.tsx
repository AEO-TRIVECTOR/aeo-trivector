import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const ogSize = { width: 1200, height: 630 }

interface OgImageProps {
  title: string
  anchor: string
}

/**
 * Shared OG image generator.
 *
 * Fonts: uses system-safe serif/mono stack that next/og supports without any
 * external fetch. This avoids build-time failures when the Google Fonts CDN
 * is unreachable (e.g. in sandboxed CI environments). The visual result is
 * virtually identical — the fallback serif renders at the same weight and
 * proportion as Cormorant Garamond.
 */
export async function generateOgImage({ title, anchor }: OgImageProps): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(200,168,75,0.07) 0%, rgba(0,0,0,0) 65%)',
          }}
        />

        {/* Decorative corner accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '320px',
            height: '320px',
            background:
              'radial-gradient(circle at top left, rgba(200,168,75,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Top: wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              letterSpacing: '0.28em',
              color: '#C8A84B',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            AEO TRIVECTOR
          </span>
        </div>

        {/* Middle: route title + anchor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '88px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(220,220,220,0.7)',
              lineHeight: 1.55,
              maxWidth: '820px',
            }}
          >
            {anchor}
          </span>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Bottom-left: byline */}
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '18px',
              color: 'rgba(180,180,180,0.55)',
              letterSpacing: '0.04em',
            }}
          >
            Jared D. Dunahay · AEO Trivector LLC
          </span>

          {/* Bottom-right: triad glyphs */}
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '40px',
              color: '#C8A84B',
              letterSpacing: '0.5em',
              opacity: 0.75,
            }}
          >
            △ ◯ ◇
          </span>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}

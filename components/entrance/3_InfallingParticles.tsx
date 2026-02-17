// ============================================================
// INFALLING PARTICLE WIND
// Sparse particles spiraling into the event horizon
// Add to EventHorizon.tsx Scene
// ============================================================

function InfallingParticles({ count = 10, radius = 7.5 }) {
  const ref = useRef<THREE.Points>(null!)

  const [particleData] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      r: radius + Math.random() * 3.5,
      height: -0.6 + Math.random() * 1.2,
      speed: 0.04 + Math.random() * 0.05,
      fall: 0.18 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      size: 0.04 + Math.random() * 0.03,
    }))
  )

  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const sizes = useMemo(() => new Float32Array(count), [count])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const p = particleData[i]
      let r = p.r - p.fall * (t * 0.5 + p.phase * 0.3)
      let ang = p.angle + p.speed * (t + p.phase)

      // Reset when hitting event horizon
      if (r < 4.8) {
        r = p.r + Math.random() * 2.5
        p.angle = Math.random() * Math.PI * 2
      }

      const idx = i * 3
      positions[idx] = r * Math.cos(ang)
      positions[idx + 1] = p.height
      positions[idx + 2] = r * Math.sin(ang) * 0.15

      // Fade and shrink near horizon
      const distFade = smoothstep(5.5, 4.9, r)
      sizes[i] = p.size * (1.0 - distFade * 0.7)
    }

    if (ref.current) {
      const geo = ref.current.geometry
      geo.attributes.position.array = positions
      geo.attributes.position.needsUpdate = true
      geo.attributes.size.array = sizes
      geo.attributes.size.needsUpdate = true
    }
  })

  // Smooth step function
  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
  }

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation
        color="#f9ecd0"
        opacity={0.8}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// USAGE: Add to Scene component
// <InfallingParticles count={10} radius={7.5} />

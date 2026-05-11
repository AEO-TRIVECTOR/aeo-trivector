'use client'

import dynamic from 'next/dynamic'

// Lazy-load KaTeX to keep First Load JS under 500 kB
const InlineMath = dynamic(
  () => import('react-katex').then((m) => ({ default: m.InlineMath })),
  { ssr: false, loading: () => <span className="opacity-40">…</span> }
)
const BlockMath = dynamic(
  () => import('react-katex').then((m) => ({ default: m.BlockMath })),
  { ssr: false, loading: () => <div className="opacity-40 text-center py-2">…</div> }
)
// Lazy-load the recharts chart as a single self-contained component
const DimensionPlot = dynamic(() => import('@/components/DimensionPlot'), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl p-4 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(252,211,77,0.15)', height: 300 }}
    >
      <span className="font-mono text-xs text-[#9CA3AF]">Loading chart…</span>
    </div>
  ),
})

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  children,
  id,
}: {
  title: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <div id={id}>
      <div
        className="relative rounded-2xl p-10"
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(252, 211, 77, 0.2)',
          boxShadow: '0 0 25px rgba(252, 211, 77, 0.1), inset 0 0 40px rgba(252, 211, 77, 0.03)',
        }}
      >
        <div
          className="absolute top-0 left-0 w-32 h-32 rounded-tl-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(252, 211, 77, 0.15), transparent 70%)',
            opacity: 0.6,
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2
            className="font-serif text-3xl tracking-wide mb-8 text-[#FCD34D]"
            style={{
              textShadow: '0 0 20px rgba(252, 211, 77, 0.3)',
              letterSpacing: '0.12em',
              fontWeight: 300,
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Main client content ──────────────────────────────────────────────────────
export default function MathematicsContent() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-32 space-y-12">

      {/* B.1 — Mathematical Constants */}
      <Section title="The Four Constants" id="constants">
        <p className="text-[#E5E5E5]/70 mb-8 leading-relaxed">
          The framework is anchored by four constants that together determine the geometry of
          self-encoding dynamics. All four are exact — not fitted parameters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              symbol: '\\mu',
              label: 'Self-Encoding Fixed Point',
              value: '= W(1) = 0.567143\\ldots',
              desc: 'Fixed point of x = e^{−x}. The primitive constraint: attractor-stable systems satisfy this relation.',
              color: '#FCD34D',
            },
            {
              symbol: '\\varphi',
              label: 'Golden Ratio',
              value: '= \\tfrac{1+\\sqrt{5}}{2} = 1.618034\\ldots',
              desc: 'Governs dimension selection and the incompleteness parameter β.',
              color: '#3B82F6',
            },
            {
              symbol: '\\Omega',
              label: 'Spinor Complement',
              value: '= \\sqrt{1-\\mu^2} = 0.823619\\ldots',
              desc: 'Exact. Governs global integration structure in the spectral triple.',
              color: '#FCD34D',
            },
            {
              symbol: '\\beta',
              label: 'Golden Incompleteness',
              value: '= \\varphi^{-1}/3 = 0.206011\\ldots',
              desc: 'Controls balance between structure and dynamics; encodes the incompleteness of self-reference.',
              color: '#3B82F6',
            },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{
                border: `1px solid ${c.color}30`,
                background: `${c.color}08`,
              }}
            >
              <div
                className="text-3xl mb-2"
                style={{ color: c.color, textShadow: `0 0 12px ${c.color}60` }}
              >
                <InlineMath math={c.symbol} />
              </div>
              <div className="font-mono text-xs text-[#9CA3AF] mb-2">{c.label}</div>
              <div className="text-sm mb-3" style={{ color: c.color }}>
                <InlineMath math={c.value} />
              </div>
              <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* B.2 — Dimension Selection */}
      <Section title="Dimension Selection" id="dimension-selection">
        <p className="text-[#E5E5E5]/70 mb-4 leading-relaxed">
          The equilibrium dimension <InlineMath math="x^*(\mu)" /> is determined by the
          balance between the golden ratio and the spinor complement:
        </p>
        <div className="my-6 text-center">
          <BlockMath math="x^*(\mu) = \frac{1}{\varphi\,\sqrt{1-\mu^2} - 1}" />
        </div>
        <p className="text-[#E5E5E5]/70 mb-2 leading-relaxed">
          At <InlineMath math="\mu = W(1) = 0.567143" />, this yields{' '}
          <InlineMath math="x^* = 3.006" /> — selecting three spatial dimensions through
          three independent mechanisms:
        </p>
        <ul className="space-y-2 mb-8 pl-4">
          {[
            'Fixed-point convergence of the self-encoding map',
            'Golden-ratio incompleteness at the spinor boundary',
            'Dimensional resonance with the Clifford algebra Cl(3,0)',
          ].map((m, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#E5E5E5]/70">
              <span className="font-mono text-[#FCD34D]/60 mt-0.5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              {m}
            </li>
          ))}
        </ul>

        {/* Lazy-loaded recharts plot */}
        <DimensionPlot />
      </Section>

      {/* B.3 — Constraint Hierarchy */}
      <Section title="The Constraint Hierarchy" id="constraint-hierarchy">
        <p className="text-[#E5E5E5]/70 mb-8 leading-relaxed">
          The framework is organised as six nested levels. Each level adds a constraint
          that the system must satisfy to achieve self-encoding stability.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(252,211,77,0.2)' }}>
                {['Level', 'Name', 'Constraint', 'Role'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 font-mono text-xs text-[#FCD34D]/70 tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  level: '0',
                  name: 'Primitive',
                  constraint: 'μ = e^{-μ}',
                  role: 'Self-encoding fixed point; attractor ground state',
                },
                {
                  level: '1',
                  name: 'Spinor Complement',
                  constraint: '\\Omega = \\sqrt{1-\\mu^2}',
                  role: 'Orthogonal completion; spinor boundary condition',
                },
                {
                  level: '2',
                  name: 'Dimensional Resonance',
                  constraint: 'x^*(\\mu) = 3.006 \\approx 3',
                  role: 'Selects three spatial dimensions via golden-ratio balance',
                },
                {
                  level: '3',
                  name: 'Golden Incompleteness',
                  constraint: '\\beta = \\varphi^{-1}/3',
                  role: 'Encodes irreducible incompleteness of self-reference',
                },
                {
                  level: '4',
                  name: 'Spectral Triple',
                  constraint: '(\\mathcal{A}, \\mathcal{H}, D)',
                  role: 'Full noncommutative geometry; Dirac operator on T⁸_Θ',
                },
                {
                  level: '5',
                  name: 'Attractor Stability',
                  constraint: '\\|D\\psi\\| \\leq \\mu\\|\\psi\\|',
                  role: 'Lyapunov-stable dynamics on the graded hypertorus',
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="transition-colors duration-200 hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-4 font-mono text-[#FCD34D]/60 text-xs">{row.level}</td>
                  <td className="py-3 px-4 font-mono text-white text-xs">{row.name}</td>
                  <td className="py-3 px-4 text-[#3B82F6]">
                    <InlineMath math={row.constraint} />
                  </td>
                  <td className="py-3 px-4 text-[#E5E5E5]/60 text-xs leading-relaxed">
                    {row.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* B.4 — Graded Hypertorus T⁸_Θ */}
      <Section title="The Graded Hypertorus T⁸_Θ" id="hypertorus">
        <p className="text-[#E5E5E5]/70 mb-6 leading-relaxed">
          The geometry is realised on the graded hypertorus{' '}
          <InlineMath math="T^8_\Theta = S^1 \times T^3 \times T^3 \times S^1" />, a
          noncommutative deformation of the eight-dimensional torus by the skew-symmetric
          matrix <InlineMath math="\Theta" />. The four factors encode the four constraint
          levels: primitive, architectural, dimensional, and derived.
        </p>

        {/* Spectral Triple subsection */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <h3 className="font-mono text-base text-[#3B82F6] mb-4 tracking-wide">
            Spectral Triple Structure (A, H, D)
          </h3>
          <p className="text-sm text-[#E5E5E5]/70 mb-5 leading-relaxed">
            Following Connes–Landi{' '}
            <a
              href="https://arxiv.org/abs/math/0011194"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3B82F6] underline underline-offset-2 hover:text-[#60A5FA]"
            >
              (arXiv:math/0011194)
            </a>
            , the framework is formalised as a spectral triple{' '}
            <InlineMath math="(\mathcal{A}, \mathcal{H}, D)" />:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                symbol: '\\mathcal{A}',
                name: 'Algebra',
                desc: 'Smooth functions on the deformed torus T⁸_Θ; noncommutative algebra of observables',
                color: '#FCD34D',
              },
              {
                symbol: '\\mathcal{H}',
                name: 'Hilbert Space',
                desc: 'Spinor space L²(T⁸_Θ, S); representation space for the algebra action',
                color: '#3B82F6',
              },
              {
                symbol: 'D',
                name: 'Dirac Operator',
                desc: 'Self-adjoint operator encoding the metric geometry; spectrum bounded by μ',
                color: '#9CA3AF',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{ border: `1px solid ${item.color}25`, background: `${item.color}06` }}
              >
                <div className="text-2xl mb-2" style={{ color: item.color }}>
                  <InlineMath math={item.symbol} />
                </div>
                <div className="font-mono text-xs text-[#9CA3AF] mb-2">{item.name}</div>
                <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-[#E5E5E5]/60 leading-relaxed">
          The deformation parameter <InlineMath math="\Theta" /> is constrained by the
          four constants: its eigenvalues are functions of{' '}
          <InlineMath math="\mu, \varphi, \Omega, \beta" />, ensuring that the spectral
          triple is self-encoding — the geometry encodes its own constraint structure.
        </p>
      </Section>

      {/* B.5 — Empirical Status */}
      <Section title="Empirical Status" id="empirical-status">
        <p className="text-[#E5E5E5]/70 mb-6 leading-relaxed">
          Preliminary empirical work identifies three regimes in recurrent neural network
          dynamics, corresponding to the three constraint levels below the spectral triple:
        </p>
        <div className="space-y-4">
          {[
            {
              label: 'Regime I — Sub-threshold',
              systems: 'Vanilla RNNs',
              desc: 'Dynamics fail to reach the μ fixed point; attractors are unstable or degenerate.',
              color: '#9CA3AF',
            },
            {
              label: 'Regime II — Threshold',
              systems: 'GRUs',
              desc: 'Dynamics approach but do not fully satisfy the spinor complement constraint Ω; partial self-encoding.',
              color: '#3B82F6',
            },
            {
              label: 'Regime III — Self-Encoding',
              systems: 'LSTMs',
              desc: 'Dynamics satisfy all three lower-level constraints; attractors are stable and interpretable.',
              color: '#FCD34D',
            },
          ].map((r, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-lg"
              style={{ border: `1px solid ${r.color}25`, background: `${r.color}06` }}
            >
              <div className="shrink-0 mt-0.5">
                <div
                  className="w-2 h-2 rounded-full mt-1.5"
                  style={{ background: r.color }}
                />
              </div>
              <div>
                <div className="font-mono text-xs mb-1" style={{ color: r.color }}>
                  {r.label}
                </div>
                <div className="text-xs text-white/80 mb-1 font-medium">{r.systems}</div>
                <p className="text-xs text-[#E5E5E5]/60 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#9CA3AF] mt-6 leading-relaxed">
          This taxonomy is preliminary. Formal empirical validation is the subject of
          ongoing research. See{' '}
          <a href="/research" className="text-[#3B82F6] underline underline-offset-2 hover:text-[#60A5FA]">
            /research
          </a>{' '}
          for current status.
        </p>
      </Section>

    </section>
  )
}

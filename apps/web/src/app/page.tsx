export default function HomePage() {
  return (
    <main style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>sabo-mutu</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
        Professional career matching, market research, and intelligent learning platform.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href="/auth/login"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#000',
            color: '#fff',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}
        >
          Get Started
        </a>
        <a
          href="/docs"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          Documentation
        </a>
      </div>
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
        <h2>Features</h2>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Career Matcher</strong> — AI-powered job matching based on skills and preferences</li>
          <li><strong>Market Research</strong> — Salary benchmarks, skill demand, industry trends</li>
          <li><strong>Learning Engine</strong> — Personalized adaptive learning paths</li>
        </ul>
      </div>
    </main>
  )
}
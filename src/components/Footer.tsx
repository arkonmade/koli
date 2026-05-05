// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '32px 20px',
      textAlign: 'center',
      color: 'var(--gray)',
      fontSize: 13,
    }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--white)', fontSize: 16 }}>KO<span style={{ color: 'var(--lime)' }}>LI</span></span>
        {' '}— Rwanda's Influencer Platform
      </div>
      <div>Connecting brands with creators, fast.</div>
    </footer>
  )
}

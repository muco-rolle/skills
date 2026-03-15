// A hero section with text on a background image, feature list, and empty state — tests harder principles
export default function LandingPage() {
  const features = [
    { title: "Real-time Analytics", description: "Track your performance metrics as they happen with live dashboards." },
    { title: "Team Collaboration", description: "Work together seamlessly with shared workspaces and instant notifications." },
    { title: "Smart Automation", description: "Set up workflows that handle repetitive tasks automatically so you can focus on what matters." },
    { title: "Enterprise Security", description: "Bank-grade encryption and compliance certifications keep your data safe." },
  ];

  const recentActivity: never[] = []; // empty state

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* Hero with background image */}
      <section style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '42px', color: 'white', marginBottom: '15px' }}>
          Build Better Products Faster
        </h1>
        <p style={{ fontSize: '18px', color: 'white', marginBottom: '30px' }}>
          The all-in-one platform for modern teams. Ship features, track metrics, and delight customers.
        </p>
        <button style={{
          padding: '12px 32px', background: '#4a90d9', color: 'white',
          border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer'
        }}>
          Start Free Trial
        </button>
      </section>

      {/* Features section with bullet points */}
      <section style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', color: '#333', textAlign: 'center', marginBottom: '30px' }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {features.map((feature, i) => (
            <div key={i} style={{ padding: '15px' }}>
              <div style={{
                width: '48px', height: '48px', background: '#4a90d9',
                borderRadius: '50%', marginBottom: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '24px', fontWeight: 'bold'
              }}>
                {i + 1}
              </div>
              <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '5px' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: '#999', lineHeight: '1.3' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity - empty state */}
      <section style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Recent Activity</h2>
        {recentActivity.length === 0 && (
          <div style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center', color: '#999' }}>
            No activity yet.
          </div>
        )}
      </section>
    </div>
  );
}

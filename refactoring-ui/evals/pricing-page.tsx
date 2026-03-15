// A pricing page with common design problems for eval testing
export default function PricingPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '28px', color: '#333', textAlign: 'center' }}>
        Choose Your Plan
      </h1>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '16px', lineHeight: '1.2' }}>
        We offer three plans to fit your needs. Whether you're just getting started or running a large enterprise,
        we have the perfect solution for you. Our plans are designed to scale with your business and provide
        all the tools you need to succeed in today's competitive landscape.
      </p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        {/* Basic Plan */}
        <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', color: '#333' }}>BASIC</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>For individuals and small teams</p>
          <div style={{ fontSize: '36px', color: '#333', margin: '10px 0' }}>
            <span style={{ fontSize: '18px' }}>$</span>9<span style={{ fontSize: '14px', color: '#999' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '1.3' }}>
            <li>5 Projects</li>
            <li>10GB Storage</li>
            <li>Email Support</li>
            <li>Basic Analytics</li>
          </ul>
          <button style={{
            marginTop: '15px', padding: '8px 16px', background: '#4a90d9',
            color: 'white', border: 'none', borderRadius: '3px', width: '100%',
            fontSize: '14px', cursor: 'pointer'
          }}>
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{ border: '2px solid #4a90d9', padding: '20px', width: '300px', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', color: '#333' }}>PRO</h2>
          <span style={{ background: '#4a90d9', color: 'white', padding: '2px 8px', fontSize: '11px', borderRadius: '2px' }}>POPULAR</span>
          <p style={{ fontSize: '14px', color: '#999' }}>For growing businesses</p>
          <div style={{ fontSize: '36px', color: '#333', margin: '10px 0' }}>
            <span style={{ fontSize: '18px' }}>$</span>29<span style={{ fontSize: '14px', color: '#999' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '1.3' }}>
            <li>Unlimited Projects</li>
            <li>100GB Storage</li>
            <li>Priority Support</li>
            <li>Advanced Analytics</li>
            <li>Team Collaboration</li>
          </ul>
          <button style={{
            marginTop: '15px', padding: '8px 16px', background: '#4a90d9',
            color: 'white', border: 'none', borderRadius: '3px', width: '100%',
            fontSize: '14px', cursor: 'pointer'
          }}>
            Get Started
          </button>
        </div>

        {/* Enterprise Plan */}
        <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '20px', color: '#333' }}>ENTERPRISE</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>For large organizations</p>
          <div style={{ fontSize: '36px', color: '#333', margin: '10px 0' }}>
            <span style={{ fontSize: '18px' }}>$</span>99<span style={{ fontSize: '14px', color: '#999' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#666', lineHeight: '1.3' }}>
            <li>Everything in Pro</li>
            <li>Unlimited Storage</li>
            <li>24/7 Phone Support</li>
            <li>Custom Integrations</li>
            <li>SLA Guarantee</li>
            <li>Dedicated Account Manager</li>
          </ul>
          <button style={{
            marginTop: '15px', padding: '8px 16px', background: 'white',
            color: '#4a90d9', border: '1px solid #4a90d9', borderRadius: '3px', width: '100%',
            fontSize: '14px', cursor: 'pointer'
          }}>
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}

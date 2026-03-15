// A form component with common design problems for eval testing
export default function ContactForm() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '24px', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        Contact Information
      </h1>

      <form>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
            First Name
          </label>
          <input type="text" style={{
            width: '100%', padding: '6px', border: '1px solid #ccc',
            borderRadius: '2px', fontSize: '14px'
          }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
            Last Name
          </label>
          <input type="text" style={{
            width: '100%', padding: '6px', border: '1px solid #ccc',
            borderRadius: '2px', fontSize: '14px'
          }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
            Email Address
          </label>
          <input type="email" style={{
            width: '100%', padding: '6px', border: '1px solid #ccc',
            borderRadius: '2px', fontSize: '14px'
          }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
            Phone Number
          </label>
          <input type="tel" style={{
            width: '100%', padding: '6px', border: '1px solid #ccc',
            borderRadius: '2px', fontSize: '14px'
          }} />
        </div>

        <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '15px' }}>
          Address
        </h2>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
            Street Address
          </label>
          <input type="text" style={{
            width: '100%', padding: '6px', border: '1px solid #ccc',
            borderRadius: '2px', fontSize: '14px'
          }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
              City
            </label>
            <input type="text" style={{
              width: '100%', padding: '6px', border: '1px solid #ccc',
              borderRadius: '2px', fontSize: '14px'
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
              State
            </label>
            <select style={{
              width: '100%', padding: '6px', border: '1px solid #ccc',
              borderRadius: '2px', fontSize: '14px', background: 'white'
            }}>
              <option>Select...</option>
            </select>
          </div>
          <div style={{ width: '120px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#aaa', marginBottom: '3px' }}>
              ZIP
            </label>
            <input type="text" style={{
              width: '100%', padding: '6px', border: '1px solid #ccc',
              borderRadius: '2px', fontSize: '14px'
            }} />
          </div>
        </div>

        <h2 style={{ fontSize: '20px', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '15px' }}>
          Preferences
        </h2>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '14px', color: '#aaa' }}>
            <input type="checkbox" style={{ marginRight: '5px' }} />
            Send me email updates
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '14px', color: '#aaa' }}>
            <input type="checkbox" style={{ marginRight: '5px' }} />
            I agree to the terms and conditions
          </label>
        </div>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '15px' }}>
          <button style={{
            padding: '8px 24px', background: '#4a90d9', color: 'white',
            border: 'none', borderRadius: '3px', fontSize: '14px', cursor: 'pointer'
          }}>
            Submit
          </button>
          <button style={{
            padding: '8px 24px', background: 'white', color: '#666',
            border: '1px solid #ccc', borderRadius: '3px', fontSize: '14px',
            cursor: 'pointer', marginLeft: '10px'
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

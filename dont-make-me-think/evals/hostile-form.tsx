import React from "react";

export default function RegistrationForm() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px" }}>
      <h1>Create Your Account</h1>
      <p>
        Welcome! We're excited to have you join our community of innovators
        and thought leaders. Please fill out the form below to create your
        account. All fields are required unless otherwise noted. Please make
        sure to enter your information exactly as instructed to avoid errors
        during the registration process. If you have any questions about the
        registration process, please consult our FAQ section.
      </p>

      <form>
        <div style={{ marginBottom: "12px" }}>
          <label>Title *</label>
          <select required>
            <option value="">Select...</option>
            <option>Mr.</option>
            <option>Mrs.</option>
            <option>Ms.</option>
            <option>Dr.</option>
            <option>Prof.</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>First Name *</label>
          <input type="text" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Last Name *</label>
          <input type="text" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Email Address *</label>
          <input type="email" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Confirm Email Address *</label>
          <input type="email" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Phone Number * (Format: (555) 123-4567)</label>
          <input
            type="tel"
            required
            pattern="\(\d{3}\) \d{3}-\d{4}"
            title="Please enter phone number in the format: (555) 123-4567"
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Fax Number</label>
          <input type="tel" />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Date of Birth * (MM/DD/YYYY)</label>
          <input
            type="text"
            required
            pattern="\d{2}/\d{2}/\d{4}"
            title="Please enter date in the format: MM/DD/YYYY"
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Company Name *</label>
          <input type="text" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Job Title *</label>
          <input type="text" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Industry *</label>
          <select required>
            <option value="">Select your industry...</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Manufacturing</option>
            <option>Retail</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Company Size *</label>
          <select required>
            <option value="">Select...</option>
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>201-1000</option>
            <option>1001+</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>How did you hear about us? *</label>
          <select required>
            <option value="">Select...</option>
            <option>Search Engine</option>
            <option>Social Media</option>
            <option>Friend/Colleague</option>
            <option>Advertisement</option>
            <option>Conference</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Password *</label>
          <input type="password" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Confirm Password *</label>
          <input type="password" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input type="checkbox" required />
            I agree to the <a href="/terms">Terms of Service</a>,{" "}
            <a href="/privacy">Privacy Policy</a>,{" "}
            <a href="/cookies">Cookie Policy</a>,{" "}
            <a href="/acceptable-use">Acceptable Use Policy</a>, and{" "}
            <a href="/data-processing">Data Processing Agreement</a>
          </label>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input type="checkbox" defaultChecked />
            Yes, I'd like to receive promotional emails, newsletters,
            product updates, partner offers, and survey invitations
          </label>
        </div>

        <button
          type="submit"
          style={{ padding: "10px 20px", background: "#4a90d9", color: "white", border: "none", cursor: "pointer" }}
        >
          Submit
        </button>

        <p style={{ marginTop: "16px", fontSize: "11px", color: "#999" }}>
          By creating an account, your data will be processed in accordance
          with applicable laws. Account creation requires a valid credit card
          which will be charged $9.99/month after your 14-day trial period.
          Cancel anytime by calling our support team during business hours
          (Mon-Fri 9am-5pm EST).
        </p>
      </form>
    </div>
  );
}

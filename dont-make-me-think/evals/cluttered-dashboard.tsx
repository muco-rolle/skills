import React from "react";

export default function Dashboard() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "8px", padding: "12px", borderBottom: "1px solid #eee" }}>
        <a href="/">SaaSly</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/analytics">Analytics</a>
        <a href="/insights">Insights</a>
        <a href="/reports">Reports</a>
        <a href="/data-explorer">Data Explorer</a>
        <a href="/metrics">Metrics</a>
        <a href="/kpis">KPIs</a>
        <a href="/benchmarks">Benchmarks</a>
        <a href="/trends">Trends</a>
        <a href="/forecasts">Forecasts</a>
        <a href="/settings">Settings</a>
        <a href="/admin">Admin</a>
        <a href="/integrations">Integrations</a>
        <a href="/billing">Billing</a>
      </nav>

      <div style={{ padding: "24px" }}>
        <h2>Welcome to Your Command Center!</h2>
        <p>
          We're thrilled to have you here! Your personalized dashboard is your
          one-stop destination for all the powerful insights and analytics tools
          you need to supercharge your business growth. Our cutting-edge platform
          leverages advanced algorithms to bring you real-time data that matters
          most to your organization's success story.
        </p>
        <p>
          To get started, simply navigate through the intuitive menu options
          above. Each section has been carefully designed by our world-class team
          to provide you with the most comprehensive view of your data. You can
          click on any of the navigation items to explore different areas of the
          platform. If you need help, check our comprehensive documentation.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginTop: "20px" }}>
          <div style={{ padding: "16px", border: "1px solid #ddd" }}>
            <span style={{ fontSize: "14px", color: "#333" }}>Revenue</span>
            <div style={{ fontSize: "14px", color: "#333" }}>$48,250</div>
          </div>
          <div style={{ padding: "16px", border: "1px solid #ddd" }}>
            <span style={{ fontSize: "14px", color: "#333" }}>Users</span>
            <div style={{ fontSize: "14px", color: "#333" }}>2,847</div>
          </div>
          <div style={{ padding: "16px", border: "1px solid #ddd" }}>
            <span style={{ fontSize: "14px", color: "#333" }}>Conversions</span>
            <div style={{ fontSize: "14px", color: "#333" }}>3.6%</div>
          </div>
          <div style={{ padding: "16px", border: "1px solid #ddd" }}>
            <span style={{ fontSize: "14px", color: "#333" }}>Churn</span>
            <div style={{ fontSize: "14px", color: "#333" }}>1.2%</div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <a href="#" style={{ color: "blue" }}>Learn more</a> |
          <a href="#" style={{ color: "blue" }}>Click here</a> |
          <a href="#" style={{ color: "blue" }}>Go</a> |
          <a href="#" style={{ color: "blue" }}>See details</a>
        </div>
      </div>
    </div>
  );
}

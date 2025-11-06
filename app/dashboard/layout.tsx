// Ensure there is a default export
export default function DashboardLayout({ children }) {
  return (
    <div>
      {/* Header component */}
      <header>
        <h1>Dashboard</h1>
      </header>
      {/* Main content area */}
      <main>{children}</main>
      {/* Footer component */}
      <footer>
        <p>© 2023 Your Company</p>
      </footer>
    </div>
  )
}

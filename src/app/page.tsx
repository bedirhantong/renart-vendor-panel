// This page will be handled by middleware
// Users will be redirected to either /login or /dashboard
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">RENART Vendor Panel</h1>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  )
}

export function DashboardFooter() {
  return (
    <footer className="border-t p-4">
      <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <p>© 2024 Your Company. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-foreground">
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}

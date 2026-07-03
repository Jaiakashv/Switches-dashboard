export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-center text-xs text-[var(--text-muted)]">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p>&copy; {currentYear} NMS Pro. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[var(--text)] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">Terms</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  )
}

interface ResultsLayoutProps {
  children: React.ReactNode
}

export default function ResultsLayout({ children }: ResultsLayoutProps) {
  return <div className="min-h-screen">{children}</div>
}

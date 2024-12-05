export default function Layout({ children }: { children: React.ReactNode }) {
  return(
    <html lang="en">
      <body>
        <main className="min-h-screen h-full w-full bg-background">{children}</main>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="antialiased bg-background">
      {children}
    </main>
  );
}

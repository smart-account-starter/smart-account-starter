

export default function PrivyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[100vh] flex-col">
          {children}
    </div>
  );
}

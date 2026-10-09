import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HPF Connect",
  description: "Private Executive Meeting Platform for Hostel Prayer Fellowship",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}

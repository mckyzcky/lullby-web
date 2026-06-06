import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://lullby.mckyzcky.com"),
  title: {
    default: "Lullby",
    template: "%s | Lullby",
  },
  description: "A calm sleep sound mixer for iOS and Android.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

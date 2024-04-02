// app/layout.tsx
import Navbar from "@/components/navbar";
import "@/styles/main.scss";
import { MyProvider } from "@/context/index";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Typing test website" />
        <link rel="icon" href="./icon.ico" />
        <title>Typa</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </head>
      <body>
        <MyProvider>
          <div className="responsiveness-error">
            This webpage is intended for desktop use only!
          </div>
          <Navbar />
          {children}
          <Footer />
        </MyProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClarioMind - Transform Your Drinking Habits for Good",
  description: "Science-backed alcohol reduction app for professionals. Use neuroscience and psychology to take control of your relationship with alcohol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
            <Script id="meta-pixel" strategy="afterInteractive">
                      {`
                                !function(f,b,e,v,n,t,s)
                                          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                                              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                                                        n.queue=[];t=b.createElement(e);t.async=!0;
                                                                                  t.src=v;s=b.getElementsByTagName(e)[0];
                                                                                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                                                                                                      'https://connect.facebook.net/en_US/fbevents.js');
                                                                                                                fbq('init', '1545256386698055');
                                                                                                                          fbq('track', 'PageView');
                                                                                                                                  `}
                    </Script>
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}


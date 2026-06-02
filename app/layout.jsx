import "./globals.css";

export const metadata = {
  title: "AMRYTT MEDIA · HRMS",
  description: "Internal HR Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-theme-type="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Geist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Theme flash prevention — reads localStorage before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('amrytt_hrms_theme')||'dark';var light=['light','paper','sage','rose','sand'];var type=light.includes(t)?'light':'dark';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-theme-type',type);}catch(e){}})();` }} />
      </head>
      <body>
        <div id="boot">AMRYTT · HRMS<span className="dot"></span></div>
        {children}
      </body>
    </html>
  );
}

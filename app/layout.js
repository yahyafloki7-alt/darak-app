import "./globals.css";

export const metadata = {
  title: "دارك | من المخطط إلى بيت الحلم",
  description: "حوّل مخطط منزلك من PDF أو صورة إلى تصور 3D ومخطط تقني",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

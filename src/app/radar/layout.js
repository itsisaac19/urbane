import "../styles/globals.css";

import { manrope } from "../utils/fonts";


export default function WeatherLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }) {
    return (
      <html lang="en" className={manrope.className}>
        <body>
            {children}
        </body>
      </html>
    );
}  


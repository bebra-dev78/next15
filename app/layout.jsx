import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Inter } from "next/font/google";

import NavigationEvents from "#/configs/navigation-events";
import ThemeRegistry from "#/configs/theme-registry";

import "./globals.css";

export const metadata = {
  manifest: "/manifest.json",
};

export const viewport = {
  colorScheme: "dark",
};

const inter = Inter({
  subsets: ["cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className} data-theme="dark">
        <AppRouterCacheProvider>
          <ThemeRegistry fontFamily={inter.style.fontFamily}>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
        <NavigationEvents />
      </body>
    </html>
  );
}

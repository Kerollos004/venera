import type { Metadata } from "next";
import Header from "./Components/basiccomponents/Header";
import "./globals.css";
import { ThemeProvider, FormProvider  , SelectedCommentsProvider  , OpenCheckoutProvider , OpenUpdateProfileProvider } from "./Components/assets/contexts"; 
import Footer from "./Components/basiccomponents/Footer";
import MobMenu from "./Components/basiccomponents/MobMenu";
// import Checkout from "./Components/checkoutcomponents/Checkout";
import SearchContainer from "./Components/basiccomponents/SearchContainer";


export const metadata: Metadata = {
  title: "Veneraup",
  description: "Dental Community Platform",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png",
    shortcut: "/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png",
    apple: "/images/Gemini_Generated_Image_d2y7e3d2y7e3d2y7.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <FormProvider>
            <SelectedCommentsProvider>
              <OpenCheckoutProvider>
                <OpenUpdateProfileProvider>
                    <Header />
                    {children}
                    {/* <Checkout/> */}
                    <SearchContainer/>
                    <MobMenu/>
                    <Footer/>
                </OpenUpdateProfileProvider>
              </OpenCheckoutProvider>
            </SelectedCommentsProvider>
          </FormProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

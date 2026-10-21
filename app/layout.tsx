import type { Metadata } from "next";
import Header from "./Components/basiccomponents/Header";
import "./globals.css";
import { ThemeProvider, FormProvider  , SelectedCommentsProvider  , OpenCheckoutProvider , OpenUpdateProfileProvider } from "./Components/assets/contexts"; 
import Footer from "./Components/basiccomponents/Footer";
import MobMenu from "./Components/basiccomponents/MobMenu";
// import Checkout from "./Components/checkoutcomponents/Checkout";

export const metadata: Metadata = {
  title: "venera",
  description: "venera saas app",
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

  import type { Metadata } from "next";
  import Header from "./Components/basiccomponents/Header";
  import "./globals.css";
  import { ThemeProvider, FormProvider  , SelectedCommentsProvider , SelectedPostProvider , OpenGalleryProvider , OpenSearchDoctorsProvider , OpenUpdateVisitorProfileProvider , OpenCheckoutProvider , OpenUpdateProfileProvider } from "./Components/assets/contexts"; 
  import Footer from "./Components/basiccomponents/Footer";
  import MobMenu from "./Components/basiccomponents/MobMenu";
  // import Checkout from "./Components/checkoutcomponents/Checkout";
  import MobSearchIcon from "./Components/basiccomponents/MobSearchIcon";
  import SearchContainer from "./Components/basiccomponents/SearchContainer";
export const metadata: Metadata = {
  title: "Veneraup - فينيرا أب | نظام حجز وإدارة العيادات والمواعيد",
  description: "منصة فينيرا أب (Veneraup) المتكاملة لحجز المواعيد وإدارة العيادات والملفات الطبية بسهولة.",
  keywords: ["Veneraup", "فينيرا", "فينيرا أب", "حجز مواعيد", "إدارة عيادات"],
  alternates: {
    canonical: "https://veneraup.com",
  },
  openGraph: {
    title: "Veneraup - فينيرا أب | نظام حجز وإدارة العيادات",
    description: "منصة فينيرا أب المتكاملة للأطباء والمراكز لحجز المواعيد وإدارة العيادات.",
    url: "https://veneraup.com",
    siteName: "Veneraup - فينيرا أب",
    locale: "ar_EG",
    type: "website",
  },
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
                    <OpenSearchDoctorsProvider>
                      <OpenUpdateVisitorProfileProvider>
                        <OpenGalleryProvider>
                          <SelectedPostProvider>
                            <Header />
                            {children}
                          {/* <Checkout/> */}
                            <SearchContainer />
                            <MobSearchIcon/>
                            <MobMenu/>
                            <Footer/>
                          </SelectedPostProvider>
                        </OpenGalleryProvider>
                      </OpenUpdateVisitorProfileProvider>
                    </OpenSearchDoctorsProvider>
                  </OpenUpdateProfileProvider>
                </OpenCheckoutProvider>
              </SelectedCommentsProvider>
            </FormProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

import "@styles/global.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { AppProvider } from "./Context/store";

export const metadata = {
    title: "RallyHub",
    description: "NFT ticketing service for events",
};

const RootLayout = ({ children }) => {
  
    return (
      <html lang="en">
        <body className="hero-image">
            <Provider>
                <AppProvider>
                    <div className="main">
                        <Nav/>
                        {children}
                    </div>
                </AppProvider>
            </Provider>
        </body>
      </html>
    );
  };
  
  export default RootLayout;
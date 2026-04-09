import { ChildrenProp } from "@/types/type";

import Footer from "@/components/footer";
import Header from "@/components/header";

const layout = ({ children }: ChildrenProp) => {
   return (
      <div className="relative w-full max-w-7xl mx-auto px-2">
         <Header />
         <main className="mt-3">{children}</main>
         <Footer />
      </div>
   );
};

export default layout;

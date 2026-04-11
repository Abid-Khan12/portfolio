import { ChildrenProp } from "@/types/type";

import Header from "@/components/header";

const layout = ({ children }: ChildrenProp) => {
   return (
      <div className="relative">
         <Header />
         <main className="w-full max-w-7xl mx-auto px-4">{children}</main>
      </div>
   );
};

export default layout;

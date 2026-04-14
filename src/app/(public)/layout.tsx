import { ChildrenProp } from "@/types/type";

import Header from "@/components/header/header";

const layout = ({ children }: ChildrenProp) => {
   return (
      <div className="relative">
         <Header />
         <main className="w-full">{children}</main>
      </div>
   );
};

export default layout;

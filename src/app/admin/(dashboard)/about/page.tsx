import AboutMeForm from "@/components/forms/about-form";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Manage About",
   robots: { index: false, follow: false },
};

const AboutPage = () => {
   return (
      <div className="page flex items-center justify-center pb-6">
         <AboutMeForm />
      </div>
   );
};

export default AboutPage;

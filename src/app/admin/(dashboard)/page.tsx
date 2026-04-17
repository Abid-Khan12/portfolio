import { Metadata } from "next";

import DashboardStats from "@/components/dashboard/dashboard-state-card";
import ProjectsTable from "@/components/dashboard/dashboard-project-table";

export const metadata: Metadata = {
   title: "Dashboard",
   robots: { index: false, follow: false },
};

const DashboardPage = () => {
   return (
      <div className="flex flex-col gap-8 overflow-hidden w-full h-full">
         <DashboardStats />
         <ProjectsTable
            limit={4}
            skeletonLimit={4}
         />
      </div>
   );
};

export default DashboardPage;

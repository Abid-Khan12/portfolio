import DashboardStats from "@/components/dashboard/dashboard-state-card";
import ProjectsTable from "@/components/dashboard/dashboard-project-table";

const DashboardPage = () => {
   return (
      <div className="flex flex-col gap-8 overflow-hidden w-full">
         <DashboardStats />
         <ProjectsTable />
      </div>
   );
};

export default DashboardPage;

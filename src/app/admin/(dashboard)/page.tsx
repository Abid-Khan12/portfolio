import DashboardStats from "@/components/dashboard-state-card";
import ProjectsTable from "@/components/dashboard-project-table";

const DashboardPage = () => {
   return (
      <div className="flex flex-col gap-8">
         <DashboardStats />
         <ProjectsTable />
      </div>
   );
};

export default DashboardPage;

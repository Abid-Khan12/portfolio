import DashboardStats from "@/components/dashboard/dashboard-state-card";
import ProjectsTable from "@/components/dashboard/dashboard-project-table";

const DashboardPage = () => {
   return (
      <div className="flex flex-col gap-8 overflow-hidden w-full h-full pb-5">
         <DashboardStats />
         <ProjectsTable limit={4} skeletonLimit={4} />
      </div>
   );
};

export default DashboardPage;

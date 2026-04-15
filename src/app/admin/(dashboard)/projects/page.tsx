import Link from "next/link";

import { PlusIcon } from "lucide-react";

import ProjectsTable from "@/components/dashboard/dashboard-project-table";
import { Button } from "@/components/ui/button";

const ProjectPage = () => {
   return (
      <div className="flex flex-col gap-4 h-full">
         <div className="flex items-center justify-end">
            <Button
               nativeButton={false}
               render={<Link href={"/admin/projects/create"} />}
            >
               <PlusIcon data-icon="inline-start" />
               Add Project
            </Button>
         </div>
         <ProjectsTable
            limit={6}
            skeletonLimit={6}
            api_key="projects_page_table_fetch"
         />
      </div>
   );
};

export default ProjectPage;

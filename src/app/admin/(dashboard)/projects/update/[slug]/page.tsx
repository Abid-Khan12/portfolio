import ProjectUpdateForm from "@/components/forms/project-update-form";

const UpdateProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
   const { slug } = await params;
   return (
      <div className="page flex items-center justify-center pb-6">
         <ProjectUpdateForm slug={slug} />
      </div>
   );
};

export default UpdateProjectPage;

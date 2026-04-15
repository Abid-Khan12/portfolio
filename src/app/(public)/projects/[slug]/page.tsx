import SingleProjectSection from "@/components/sections/projects/single-project-section";

const SingleProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
   const { slug } = await params;

   return (
      <main className="flex flex-col gap-10">
         <SingleProjectSection slug={slug} />
      </main>
   );
};

export default SingleProjectPage;

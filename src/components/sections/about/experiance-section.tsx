const MyExperiance = [
   {
      from: "Sep 2025",
      to: "Dec 2025",
      companyName: "Intersys",
      role: "Frontend Developer Intern",
      description:
         "Collaborated on building responsive web applications using the modern React ecosystem. Developed reusable UI components with Shadcn UI and Tailwind CSS, improving development speed for new features. Integrated REST APIs with React Query, optimized caching strategies, and improved data loading performance while reducing redundant network requests.",
   },
] as const;

const ExperianceSection = () => {
   return (
      <section className="min-h-[60svh] w-full flex justify-between gap-5 lg:flex-nowrap flex-wrap max-w-7xl mx-auto py-16 px-6">
         <div className="flex items-start justify-start shrink-0">
            <h2 className="font-heading md:text-8xl sm:text-7xl text-5xl">My Experience</h2>
         </div>
         <div className="flex flex-col gap-6 items-start w-full lg:max-w-[600px]">
            {MyExperiance.map((item) => (
               <div key={item.companyName}>
                  <div className="flex justify-between items-start w-full">
                     <div className="space-y-2">
                        <h3 className="sm:text-2xl text-lg font-semibold">{item.role}</h3>
                        <div className="flex items-center gap-2">
                           <p className="text-primary font-medium sm:text-lg text-base">
                              {item.companyName}
                           </p>
                           <div className="md:hidden block text-sm">
                              <span>{item.from}</span> — <span>{item.to}</span>
                           </div>
                        </div>
                     </div>
                     <div className="md:block hidden">
                        <span>{item.from}</span> — <span>{item.to}</span>
                     </div>
                  </div>

                  <p className="font-medium text-sm text-muted-foreground leading-6 mt-2">
                     {item.description}
                  </p>
               </div>
            ))}
         </div>
      </section>
   );
};

export default ExperianceSection;

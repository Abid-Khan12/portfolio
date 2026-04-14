const SkillsArr = [
   "html",
   "css",
   "tailwind",
   "Bootstrap",
   "javascript",
   "react",
   "next",
   "express",
   "shadcn",
   "react-query",
   "rest-api",
] as const;

const CapabilitiesSection = () => {
   return (
      <section className="min-h-[60svh] w-full flex justify-between gap-5 lg:flex-nowrap flex-wrap max-w-7xl mx-auto py-16 px-6">
         <div className="flex items-start justify-start shrink-0">
            <h2 className="font-heading md:text-8xl sm:text-7xl text-5xl">My Capabilities</h2>
         </div>
         <div className="flex flex-col gap-6 items-start w-full lg:max-w-[600px]">
            <p className="font-medium text-muted-foreground leading-6">
               I build scalable frontend applications with reusable components, smooth user
               experiences, and strong performance. My focus is on clean architecture, API
               integration, and modern UI development with React and Next.js.
            </p>
            <div className="grid w-full gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
               {SkillsArr.map((item) => (
                  <span
                     key={item}
                     className="uppercase font-bold text-sm py-3 rounded-full border border-border shrink-0 text-center"
                  >
                     {item}
                  </span>
               ))}
            </div>
         </div>
      </section>
   );
};

export default CapabilitiesSection;

import { Schema, model, models } from "mongoose";

export interface IProject {
   slug: string;
   title: string;
   description: string;
   role: "Frontend" | "MERN";
   githubLink: string;
   liveLink?: string;
   techStack: string[];
   projectImage: {
      width: number;
      height: number;
      url: string;
      public_id: string;
   };
   createdAt: Date;
}

const projectSchema = new Schema<IProject>(
   {
      slug: {
         type: String,
         required: [true, "Slug is required"],
      },
      title: {
         type: String,
         required: [true, "Title is required"],
      },
      description: {
         type: String,
         required: [true, "Description is required"],
      },
      role: {
         type: String,
         enum: ["Frontend", "MERN"],
         required: [true, "Role is required"],
      },
      githubLink: {
         type: String,
         required: [true, "Github Link is required"],
      },
      liveLink: {
         type: String,
         default: "",
      },
      techStack: {
         type: [String],
         required: true,
      },
      projectImage: {
         width: {
            type: Number,
            required: [true, "Width is required"],
         },
         height: {
            type: Number,
            required: [true, "Height is required"],
         },
         url: {
            type: String,
            required: [true, "URL is required"],
         },
         public_id: {
            type: String,
            required: [true, "Public Id is required"],
         },
      },
   },
   {
      timestamps: true,
   },
);

const ProjectModel = models.Project || model<IProject>("Project", projectSchema);

export default ProjectModel;

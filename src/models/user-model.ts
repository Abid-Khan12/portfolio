import bcrypt from "bcrypt";
import { Schema, model, models } from "mongoose";

export interface IUser {
   userName: string;
   email: string;
   password: string;
   avatar: {
      url: string;
      public_id: string;
   };
   comparePassword: (userPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
   {
      userName: {
         type: String,
         required: [true, "userName is required"],
      },
      email: {
         type: String,
         required: [true, "email is required"],
      },
      password: {
         type: String,
         required: [true, "password is required"],
         select: false,
      },
      avatar: {
         url: { type: String, required: [true, "avatar > url is required"] },
         public_id: {
            type: String,
            required: [true, "avatar > public_id is required"],
         },
      },
   },
   {
      timestamps: true,
   },
);

userSchema.pre("save", async function () {
   if (!this.isModified("password") || !this.password) {
      return;
   }
   this.password = await bcrypt.hash(this.password, 10);
});


const UserModel = models.User || model<IUser>("User", userSchema);

export default UserModel;

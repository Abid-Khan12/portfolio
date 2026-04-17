import { Metadata } from "next";

import LoginForm from "@/components/forms/login-form";

export const metadata: Metadata = {
   title: "Admin Login",
   robots: { index: false, follow: false },
};

const AdminLoginPage = () => {
   return (
      <div className="min-h-svh w-full flex items-center justify-center bg-background p-4">
         <LoginForm />
      </div>
   );
};

export default AdminLoginPage;

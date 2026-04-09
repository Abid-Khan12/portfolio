import IconButton from "@/components/buttons/icon-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Twitter, Github, LinkedIn } from "@/public/index";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Image from "next/image";

const page = () => {
   return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
         <h1 className="font-heading text-5xl">Heading</h1>
         <p className="text-muted-foreground font-medium text-lg">Lorem ipsum dolor sit amet.</p>

         <div className="flex items-center gap-3">
            <IconButton
               src={Github}
               alt="github-icon"
            />
            <IconButton
               src={LinkedIn}
               alt="linkedin-icon"
               className=""
            />
         </div>

         <Card className="w-sm">
            <CardHeader>
               <CardTitle className="text-2xl">Card Title</CardTitle>
               <CardDescription>Card Description</CardDescription>
            </CardHeader>
         </Card>
         <div className="flex items-center gap-4">
            <Image
               src={Twitter}
               alt="twitter-icon"
               width={32}
               height={32}
            />
            <Image
               src={Instagram}
               alt="instagram-icon"
               width={32}
               height={32}
            />
            <Image
               src={Github}
               alt="github-icon"
               width={32}
               height={32}
            />
            <Image
               src={LinkedIn}
               alt="linkedin-icon"
               width={32}
               height={32}
            />
         </div>

         <Button size={"lg"}>Click Me</Button>

         <div className="flex flex-col gap-y-3 items-start">
            <Label
               htmlFor="input-box"
               className="w-full"
            >
               Input Box
            </Label>
            <Input
               className="w-full"
               id="input-box"
            />
         </div>
         <AlertDialogDemo />
      </div>
   );
};

export default page;

export function AlertDialogDemo() {
   return (
      <AlertDialog>
         <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />
         <AlertDialogContent size="default">
            <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account from our
                  servers.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import type { Variants } from "motion/react";
import type { Transition } from "motion/react";

import { cn } from "@/lib/utils";

import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/header/header";

// ── Animated hamburger / X icon ─────────────────────────────────────────────
const HamburgerIcon = ({ open }: { open: boolean }) => {
   return (
      <div className="relative flex size-4 flex-col items-center justify-center gap-[3px]">
         {/* top bar */}
         <motion.span
            className="block h-px w-4 rounded-full bg-current origin-center"
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" as const }}
         />
         {/* middle bar */}
         <motion.span
            className="block h-px w-4 rounded-full bg-current origin-center"
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" as const }}
         />
         {/* bottom bar */}
         <motion.span
            className="block h-px w-4 rounded-full bg-current origin-center"
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" as const }}
         />
      </div>
   );
};

// ── Sidebar variants ─────────────────────────────────────────────────────────
const sidebarVariants: Variants = {
   hidden: { x: "100%", opacity: 0 },
   visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 } as Transition,
   },
   exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.25, ease: "easeInOut" as const },
   },
};

// ── Nav list variants (stagger container) ────────────────────────────────────
const listVariants: Variants = {
   hidden: {},
   visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
   },
};

const itemVariants: Variants = {
   hidden: { opacity: 0, x: 40 },
   visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 22 } as Transition,
   },
};

// ── MobileNav ────────────────────────────────────────────────────────────────
const MobileNav = () => {
   const [open, setOpen] = useState(false);

   return (
      <div className="md:hidden block">
         <motion.div
            animate={open ? { x: -222, y: 8 } : { x: 0, y: 0 }} // tweak x to match your sidebar width (w-72 = 288px, minus padding)
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-50 flex items-center justify-center"
         >
            {/* Trigger */}
            <Toggle
               pressed={open}
               onPressedChange={setOpen}
               aria-label="toggle-sidebar"
               render={
                  <Button
                     variant="outline"
                     size="icon"
                     className={cn(
                        "relative z-50 transition-colors duration-300",
                        open && "bg-muted border-transparent",
                     )}
                  />
               }
            >
               <HamburgerIcon open={open} />
            </Toggle>
         </motion.div>

         {/* Backdrop */}
         <AnimatePresence>
            {open && (
               <motion.div
                  key="backdrop"
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setOpen(false)}
               />
            )}
         </AnimatePresence>

         {/* Sidebar panel */}
         <AnimatePresence>
            {open && (
               <motion.aside
                  key="sidebar"
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                     "fixed top-0 right-0 z-40 h-full w-72",
                     "bg-background border-l border-border shadow-2xl",
                     "flex flex-col pt-20 px-8 pb-10 gap-8",
                  )}
               >
                  {/* Nav links with stagger */}
                  <motion.nav
                     variants={listVariants}
                     initial="hidden"
                     animate="visible"
                     className="flex flex-col gap-2"
                  >
                     {navLinks.map(({ href, label }) => (
                        <motion.button
                           key={href}
                           variants={itemVariants}
                           onClick={() => setOpen(false)}
                           className={cn(
                              "group flex items-center gap-3 rounded-lg px-4 py-3",
                              "text-lg font-medium text-foreground",
                              "hover:bg-accent hover:text-accent-foreground",
                              "transition-colors duration-200",
                           )}
                        >
                           {/* Animated accent bar */}
                           <motion.span
                              className="h-5 w-0.5 rounded-full bg-primary"
                              initial={{ scaleY: 0 }}
                              whileHover={{ scaleY: 1 }}
                              transition={{ duration: 0.2 }}
                           />
                           <Link href={href}>{label}</Link>
                        </motion.button>
                     ))}
                  </motion.nav>
               </motion.aside>
            )}
         </AnimatePresence>
      </div>
   );
};

export default MobileNav;

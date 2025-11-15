
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Sidebar from "./Sidebar"
import { useState } from "react";



export function AppDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline"><Menu /></Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-2">
            <DrawerTitle >
              <div className="flex justify-between items-center px-1">
                <h1 className="text-2xl font-bold bg-white cursor-pointer">AskMyData</h1>
                <X className="cursor-pointer" onClick={()=>setOpen(false)} />
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <Sidebar className="h-[calc(100vh-48px)]" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

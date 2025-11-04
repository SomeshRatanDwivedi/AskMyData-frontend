
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Folder, Upload } from "lucide-react";
import { useState } from "react";


const MenuChild = ({ setShowFile }: { setShowFile: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <div className="p-2 w-48 space-y-2">
    <Button
      variant="outline"
      className="w-full flex items-center justify-start gap-2"
    // onClick={handleUpload}
    >
      <Upload className="h-4 w-4" /> Upload File
    </Button>

    <Button
      variant="outline"
      className="w-full flex items-center justify-start gap-2"
      onClick={() => setShowFile((prev: boolean) => !prev)}
    >
      <Folder className="h-4 w-4" /> View stored files
    </Button>
  </div>
)
export function NavigationMenuDemo() {
  const [showFile, setShowFile] = useState(false);
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex items-center gap-1">
              <Folder className="h-5 w-5 mr-1" />
              Files
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <MenuChild setShowFile={setShowFile} />
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* ✅ Sidebar is rendered independently */}
      {/* {showFile && (
        <Sidebar isMobile={true} onClose={() => setShowFile(false)} />
      )} */}
    </>
  )
}


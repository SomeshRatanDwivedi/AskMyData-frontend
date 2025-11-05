
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button";
import { Folder, Upload } from "lucide-react";


const MenuChild = () => (
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
    >
      <Folder className="h-4 w-4" /> View stored files
    </Button>
  </div>
)
export function NavigationMenuDemo() {
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
              <MenuChild/>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}


import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Link from "next/link"
import { Separator } from "./ui/separator"

export default function Menu() {

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    <Link href={'/'}>
                       Home
                    </Link>
                </MenubarTrigger>
                <Separator orientation="vertical" />
                <MenubarTrigger>
                    <Link href={'/dashboard'}>
                       Dashboard
                    </Link>
                </MenubarTrigger>
                <MenubarTrigger>
                    <Link href={'/'}>
                       Settings
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>

    )
}
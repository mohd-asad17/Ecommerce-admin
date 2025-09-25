
import { UserButton } from "@clerk/nextjs"
import { MainNavbar } from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";



export const Navbar =  async () => {
    const { userId } = await auth();

    if(!userId){
        redirect('/sign-in');
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        }
    })

    return <div className="border-b">
        <div className="flex h-14 items-center px-4">
            <StoreSwitcher items={stores} />
            <MainNavbar className="mx-6"/>
            <div className="ml-auto flex items-center space-x-4">
                <UserButton />
            </div>
        </div>
    </div>
}
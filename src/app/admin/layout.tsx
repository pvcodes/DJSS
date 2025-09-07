import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions)
    if (!session?.user.isAdmin) {
        redirect('/')
    }

    // if 

    return (

        <>
            {children}
        </>
    );
}

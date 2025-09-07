/* eslint-disable */
'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import React from 'react'
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
} from "@/components/ui/alert-dialog"
import axios from 'axios'
import { useRouter } from 'next/navigation'


const BcLock = ({ chit_id, isLocked }: { chit_id: number, isLocked: boolean }) => {
    const router = useRouter()
    const handleOnClick = async () => {
        try {
            const response = await axios.post(`/api/bc/${chit_id}/lock`)

            router.refresh()
            // const
        } catch (error) {

        }

    }
    return (
        // <div className='flex flex-col justify-end'>
        //     <Button onClick={handleOnClick}>Lock</Button>
        // </div>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isLocked}>Lock BC configurations</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleOnClick}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default BcLock

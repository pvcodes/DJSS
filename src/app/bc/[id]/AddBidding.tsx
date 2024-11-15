'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'





const formSchema = z.object({
    // TODO: Validation
    participant_id: z.any(),
    bid_amount: z.any()
})




const AddBidding = ({ participants, chit_id, curr_month }) => {
    // console.log(participants, 7878)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const router = useRouter()

    const onSubmit = async (data) => {
        console.log(1234, data, biddingData.biddings.at(-1)?.bid_amount, participants)

        // TOOD: Bidding validation, bid should be more than last bid, and more (brainstrom)

        const participant = participants.find(({ participant_id }) => participant_id === parseInt(data.participant_id));

        const curr_change = data.bid_amount - (biddingData.biddings.at(-1)?.bid_amount || biddingData.starting_bid_amount)

        try {
            setBiddingData(prev => ({
                ...prev,
                biddings: [...prev.biddings, { ...data, bid_change: curr_change, bidder_name: participant.name, bid_order: prev.biddings.length + 1 }]
            }))
            // router.refresh()
        } catch (error) {
            console.log(error, 7799)
        }
    }

    const handleSaveBidding = async () => {
        try {
            await axios.post(`/api/bc/${chit_id}/bid`, biddingData)
            router.refresh()
            setBiddingData(prev => ({
                starting_bid_amount: null,
                month: curr_month + 1,
                biddings: [],
            }))
            setIsCardVisible(prev => !prev)
        } catch (error) {
            console.log(error.message, 1234)
        }
    }

    const [isCardVisible, setIsCardVisible] = useState(false);

    //  TODO: On acidental refresh, data should not be lost (maybe use localStorage)
    const [biddingData, setBiddingData] = useState({
        starting_bid_amount: null,
        month: curr_month + 1,
        biddings: [],
    })


    const handleToggle = () => {
        setBiddingData(prev => ({
            ...prev,
            biddings: [...prev.biddings]
        }))

        setIsCardVisible((prev) => !prev);
        console.log(1234, biddingData)
    };



    return (
        <div className='my-5'>
            {!isCardVisible && (

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='my-5'>
                            Start the bid
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Enter the initial bidding amount</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. Enter cautiously
                                <Input type='number' onChange={(e) => {
                                    setBiddingData(prev => ({ ...prev, starting_bid_amount: e.target.value }))
                                    console.log(e.target.value, 1234)
                                }} />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleToggle}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {isCardVisible && (
                <Card className="w-full">
                    <CardHeader className='flex flex-row justify-between'>
                        <div>
                            <CardTitle>Place the Bidding</CardTitle>
                            <CardDescription>Do not refresh, all bidding will be lost</CardDescription>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Close and Save</Button>
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
                                    <AlertDialogAction onClick={handleSaveBidding}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardHeader>
                    <CardContent>
                        {(biddingData.starting_bid_amount != null || biddingData.biddings.length > 0) && <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S No.</TableHead>
                                    <TableHead>Bidder Name</TableHead>
                                    <TableHead>Bidding Amount</TableHead>
                                    <TableHead>Changes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow key={`bidding-entry-0`}>
                                    <TableCell className="font-medium">0</TableCell>
                                    <TableCell className="font-medium">Govt. Bid</TableCell>
                                    <TableCell className="font-medium">{biddingData.starting_bid_amount}</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                                {biddingData.biddings.map((bidding, index) => {
                                    return <TableRow key={`bidding-entry-${index}`}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{bidding.bidder_name}</TableCell>
                                        <TableCell className="font-medium">{bidding.bid_amount}</TableCell>
                                        <TableCell>{bidding.bid_change}</TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='my-5 flex justify-between items-end'>
                                <FormField
                                    control={form.control}
                                    name='bid_amount'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bid Amount</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='bid amount' {...field} />
                                            </FormControl>
                                            <FormDescription>Participant's phone number to be added in the BC.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="participant_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select User</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                    {...field}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a participant" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Participants</SelectLabel>
                                                            {participants.map(participant => (
                                                                <SelectItem value={participant.participant_id} key={`select-participant${participant.participant_id}`}>{participant.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>Participant's phone number to be added in the BC.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit'>Add</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AddBidding
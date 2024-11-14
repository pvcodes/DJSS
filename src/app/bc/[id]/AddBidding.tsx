'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
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
        console.log(7878, data)

        try {
            await axios.post(`/api/bc/${chit_id}/bid`, { ...data, month: curr_month + 1 })
            router.refresh()
        } catch (error) {
            console.log(error, 7799)
        }

    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='my-2 flex justify-between'
            >
                <FormField
                    control={form.control}
                    name='bid_amount'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bid Amount</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder='bid amount'{...field} />
                            </FormControl>
                            <FormDescription>Participant's phone number to be added in the BC.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                >
                </FormField>
                <FormField
                    control={form.control}
                    name="participant_id"
                    render={({ field }) => {
                        console.log(field, 6677)
                        return (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.name}
                                        value={field.name}
                                        {...field}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Participants</SelectLabel>
                                                {participants.map(participant => (
                                                    <SelectItem value={participant.participant_id}>{participant.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>Participant's phone number to be added in the BC.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}

                />
                <Button type='submit' >Add</Button>
            </form>
        </Form>
    )
}

export default AddBidding
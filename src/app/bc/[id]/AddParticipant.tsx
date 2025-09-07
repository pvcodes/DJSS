/* eslint-disable */
'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const formSchema = z.object({
    phone_number: z.string().min(10, {
        message: 'Phone number must be of length 10'
    })
})

const AddParticipant = ({ chit_id, }: { chit_id: number }) => {
    const router = useRouter()
    console.log(7878, { chit_id })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const { pending } = useFormStatus()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        try {
            const response = await axios.post(`/api/bc/${chit_id}/add-participant`, data)
            console.log(123, { response })
            router.refresh()
        } catch (error) {
            form.setError('phone_number', {
                type: "400",
                message: "Something went wrong, refresh and retry", // TODO: good error messages
            })
            console.error(error);
        }
    };
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='my-2'
            >
                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="8933890606" {...field} type='number' />
                            </FormControl>
                            <FormDescription>Participant's phone number to be added in the BC.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={pending}>Add</Button>
            </form>
        </Form>
    )
}

export default AddParticipant
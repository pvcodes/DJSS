'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"


const formSchema = z.object({
    root: z.any(),
    name: z.string().min(5, {
        message: "Username must be at least 4 characters.",
    }),
    phone_number: z.string()
        .min(10, {
            message: 'Phone number must be of length 10'
        })
})

const ParticipantCreate = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        try {
            const response = await axios.post('/api/participant', data)
            console.log(123, { response })
            router.refresh()
        } catch (error) {
            form.setError('root', {
                type: "400",
                message: "Something went wrong, refresh and retry", // TODO: good error messages
            })
            console.error(error);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex justify-between'>
                    <div className='mr-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter name' {...field}></Input>
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name='phone_number'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter phone number' {...field} type='number'></Input>
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="mt-4">Add Participant</Button>
                </div>
                <FormField
                    control={form.control}
                    name='root'
                    render={() => (
                        <FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </form>
        </Form>

    )
}

export default ParticipantCreate
'use client'
import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { createQuery } from '@/actions/query'
import { toast } from 'sonner'

export function HomepageContact() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createQuery(email, message)
            toast.success('We have received your query!')
            setMessage('')
            setEmail('')
        } catch {
            toast.error('Something went wrong try again')

        }
    }

    return (
        <>
            <Card id="contact" className="rounded-none border-0 shadow-none">
                <CardHeader className="px-0">
                    <CardTitle>React out to us?</CardTitle>
                    <p className="text-slate-600">We are there to server you the best!</p>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className='px-0 flex flex-col gap-4' >
                        <Textarea
                            placeholder="Your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <div className="flex gap-4">
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit">Send</Button>
                        </div>
                    </CardContent>
                </form>
            </Card >
        </>
    )
}
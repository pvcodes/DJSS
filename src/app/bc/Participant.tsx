import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ParticipantCreate from './ParticipantCreate';
import { getAllParticipants } from '@/db/actions/bc/participant';
import { redirect } from 'next/navigation';



const Participant = async () => {

    const participants = await getAllParticipants()

    return (
        <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
            <AccordionItem value="item-1">
                <AccordionTrigger>View All</AccordionTrigger>
                <AccordionContent>
                    {/* TODO: Search Box */}
                    <Table>
                        <TableCaption>List of all participant</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone Number (INR) </TableHead>
                                <TableHead>Total Due (INR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.map((participant, index) => {
                                return (
                                    <TableRow key={participant.participant_id} >
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{participant.name}</TableCell>
                                        <TableCell>{participant.contact_info}</TableCell>
                                        <TableCell>{participant.created_at.toLocaleDateString()}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        {/* <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Add</AccordionTrigger>
                <AccordionContent>
                    <ParticipantCreate />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default Participant;
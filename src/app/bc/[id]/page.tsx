import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFundDetails } from '@/db/actions/bc/chitFund';
import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import AddParticipant from './AddParticipant';
import BcLock from './BcLock';
import Bid from './Bid';



export default async function SingleFundPage({ params }: { params: { id: string } }) {
    const id = parseInt((await params).id, 10)
    const fund = await getFundDetails(id)
    console.log(12313, fund, fund.participants.length)
    return (
        <Card className='rounded'>
            <CardHeader className='flex-row justify-between'>
                <h2 className='text-3xl capitalize'> {fund.name ?? 'No Name'}</h2>
                <div className='flex items-baseline'><h3 className='text-xl mr-1'>Fund Amount:</h3> <span>{fund?.fund_amount?.toString()}</span> </div>
                <div className='flex items-baseline'><h3 className='text-xl mr-1'>Interest:</h3> <span>{fund?.interest_rate?.toString()}%</span> </div>
                <div className='flex items-baseline'><h3 className='text-xl mr-1'>Created On:</h3> <span>{fund?.created_at?.toLocaleDateString()}</span> </div>
                <div className='flex items-baseline'><BcLock chit_id={id} isLocked={fund.isLocked} /></div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Current Participants</AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableCaption>A list of all BCs Exist</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">S No.</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone Number </TableHead>
                                        <TableHead>Remaining Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* {allChitFunds.map((fund, index) => { return <FundRow fund={fund} index={index} key={index} /> })} */}
                                    {fund.participants.map((participant, index) => (
                                        <TableRow>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">{participant.name}</TableCell>
                                            <TableCell>{participant.contact_info}</TableCell>
                                            <TableCell>Nil</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                    {!fund.isLocked && <AccordionItem value='item-2'  >
                        <AccordionTrigger>
                            Add New Participant
                        </AccordionTrigger>
                        <AccordionContent>
                            <AddParticipant chit_id={id} />
                        </AccordionContent>
                    </AccordionItem>}
                </Accordion>
                <Bid chit_id={id} participants={fund.participants} />
            </CardContent>
            <CardFooter className='flex justify-end'>
            </CardFooter>
        </Card>
    )
}
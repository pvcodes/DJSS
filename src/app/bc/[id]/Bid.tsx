/* eslint-disable */
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Form } from '@/components/ui/form'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getChitFundBidding, getChitFundParticipants } from '@/db/actions/bc/bid'
import AddBidding from './AddBidding'

interface Participant {
  participant_id: number;
  name: string;
}

interface BiddingEntry {
  participant_id: number;
  bid_amount: number;
}

interface BidProps {
  chit_id: number;
  participants: Participant[];
}

const Bid = async ({ chit_id, participants }: BidProps) => {
  const biddings = await getChitFundBidding(chit_id);

  return (
    <div className='mt-4'>
      <h1 className='text-3xl'>Biddings</h1>
      <Accordion type="single" collapsible className="w-full" defaultValue={`item-${biddings.length}`}>
        {biddings.map((bidding, index) => (
          <AccordionItem key={`bidding-item-${index}`} value={`item-${index + 1}`}>
            <AccordionTrigger>Month {index + 1}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S No.</TableHead>
                    <TableHead>Bidder Name</TableHead>
                    <TableHead>Bidding Amount</TableHead>
                    <TableHead>Changes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidding.map((entry, entryIndex) => {
                    const participant = participants.find(({ participant_id }) => participant_id === entry.participant_id);
                    const previousBidAmount = bidding[entryIndex - 1]?.bid_amount ?? 0;
                    const bidChange = entryIndex === 0 ? 0 : entry.bid_amount - previousBidAmount;

                    return (
                      <TableRow key={`bidding-entry-${entryIndex}`}>
                        <TableCell className="font-medium">{entryIndex + 1}</TableCell>
                        <TableCell className="font-medium">{participant?.name || 'Unknown'}</TableCell>
                        <TableCell className="font-medium">{entry.bid_amount}</TableCell>
                        <TableCell>{bidChange}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AddBidding participants={participants} chit_id={chit_id} curr_month={biddings.length} />
    </div>
  );
}

export default Bid;

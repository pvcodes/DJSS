/* eslint-disable */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllChitParticipants, getAllFunds } from "@/db/actions/bc/chitFund"
import { redirect } from "next/navigation"
import FundRow from "./FundRow"





export default async function BCList() {
  const allChitFunds = await getAllFunds()
  return (
    <Table>
      <TableCaption>A list of all BCs Exist</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>S No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Fund Amount (INR) </TableHead>
          <TableHead>Interest Rate</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allChitFunds.map((fund, index) => { return <FundRow fund={fund} index={index} key={index} /> })}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}

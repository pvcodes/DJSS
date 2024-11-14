'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { redirect } from 'next/navigation'
import React from 'react'
const FundRow = ({ fund, index }) => {
    return (
        <TableRow key={fund.chit_id} onClick={() => redirect(`/bc/${fund.chit_id}`)}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{fund.name}</TableCell>
            <TableCell>{fund.fund_amount}</TableCell>
            <TableCell>{`${fund.interest_rate}%`}</TableCell>
            <TableCell className="text-right">{fund.created_at.toLocaleDateString()}</TableCell>
        </TableRow>
    )
}

export default FundRow
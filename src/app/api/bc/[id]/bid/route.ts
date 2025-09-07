/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import dbClient from "@/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // phone_number: string;
    const { id } = await params;
    const body = await req.json();

    console.log(1233, body);

    const data = body.biddings.map((bidding: any) => ({
      chit_id: parseInt(id),
      month: body.month,
      participant_id: parseInt(bidding.participant_id),
      bid_amount: parseInt(bidding.bid_amount),
      bid_order: parseInt(bidding.bid_order),
    }));

    console.log(data, 123);

    const bid = await dbClient.bid.createMany({
      data,
    });

    // CREATE INSTALLMENTS - START

    //  sort the bids by bid_order, to identify 1st, 2nd, 3rd
    data.sort((a, b) => a.bid_order - b.bid_order);
    const topThreeBids = data.slice(-3);
    // const firstInstallment

    return NextResponse.json({ bid });
  } catch (error) {
    // TODO: better error handling
    console.log(error.message);
    return NextResponse.json({ as: 1 }, { status: 400 });
  }
}

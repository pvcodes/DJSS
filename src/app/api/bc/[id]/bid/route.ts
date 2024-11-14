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
		const { participant_id, bid_amount, month } = body;

		// TODO: zod validations

		// await dbClient.bid.deleteMany({ where: { chit_id: parseInt(id) } });
		// return NextResponse.json({ id });

		const maxValue = await dbClient.bid.aggregate({
			_max: {
				bid_order: true,
			},
			where: {
				chit_id: parseInt(id),
				month,
			},
		});

		const bid_order = maxValue._max.bid_order ?? 0;

		const bid = await dbClient.bid.create({
			data: {
				chit_id: parseInt(id),
				participant_id: parseInt(participant_id),
				bid_order: bid_order + 1,
				month,
				bid_amount: parseInt(bid_amount),
			},
		});

		return NextResponse.json({ bid });
	} catch (error) {
		// TODO: better error handling
		console.log(error.message);
		return NextResponse.json({ as: 1 }, { status: 400 });
	}
}

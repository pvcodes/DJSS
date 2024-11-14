import { NextRequest, NextResponse } from "next/server";
import dbClient from "@/db/";
import { NextApiRequest } from "next";

export async function POST(req: NextRequest) {
	try {
		// {
		// 	"bc_name": "new fund",
		// 	"total_lot_amount": 100000,
		// 	"interest_rate": 2,
		// 	"second_person_discount": 799,
		// 	"third_person_discount": 200
		// }
		const payload = (await req?.json()) ?? {};

		// TODO: zod validations

		const data = {
			name: payload.bc_name,
			fund_amount: payload.total_lot_amount,
			interest_rate: payload.interest_rate,
			discount_lsecond: payload.second_person_discount,
			discount_lthird: payload.third_person_discount,
			start_bid:
				(payload.total_lot_amount & (payload.interest_rate * 12)) / 100,
		};

		console.log(123, data);

		const fund = await dbClient.chitFund.create({ data });
		console.log(fund);
		return NextResponse.json(fund);
	} catch (error) {
		// TODO: better error handling
		return NextResponse.json({ as: 1 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const queryParams = req.nextUrl.searchParams;
		const chit_id = parseInt(queryParams.get("chit_id"), 10);
		const fund = await dbClient.chitFund.findUnique({
			where: {
				chit_id,
			},
		});
		return NextResponse.json(fund);
	} catch (error) {
		console.log(error, 324);
		return NextResponse.json(error);
	}
}

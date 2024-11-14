import { NextRequest, NextResponse } from "next/server";
import dbClient from "@/db";

export async function POST(req: NextRequest) {
	try {
		// 	name: string;
		// phone_number: string;
		const body = await req?.json();
		const { name, phone_number } = body;

		console.log(8989, { name, phone_number });

		// TODO: zod validations
		const fund = await dbClient.participant.create({
			data: {
				name: name,
				contact_info: phone_number,
			},
		});
		console.log(fund);
		return NextResponse.json(fund);
	} catch (error) {
		console.log(error.message);
		// TODO: better error handling
		return NextResponse.json({ as: 1 }, { status: 400 });
	}
}

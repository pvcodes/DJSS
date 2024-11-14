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
		const { phone_number } = body;

		// TODO: zod validations

		const participant = await dbClient.participant.findFirst({
			where: { contact_info: phone_number },
		});

		console.log(123, participant);

		const data = {
			chit_id: id,
			participant_id: participant?.participant_id,
		};

		console.log(999, data);

		const fund = await dbClient.chitFundParticipant.create({
			data: {
				chit_id: parseInt(id),
				participant_id: participant?.participant_id,
			},
		});
		console.log(fund);
		return NextResponse.json(fund);
	} catch (error) {
		// TODO: better error handling
		console.log(error.message);
		return NextResponse.json({ as: 1 }, { status: 400 });
	}
}

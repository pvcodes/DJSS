import { NextRequest, NextResponse } from "next/server";
import dbClient from "@/db";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// phone_number: string;
		const chit_id = parseInt((await params).id, 10);

		await dbClient.chitFund.update({
			where: { chit_id },
			data: {
				isLocked: {
					set: true,
				},
			},
		});

		return NextResponse.json({ status: "ok" });
	} catch (error) {
		// TODO: better error handling
		console.log(error.message);
		return NextResponse.json({ as: 1 }, { status: 400 });
	}
}

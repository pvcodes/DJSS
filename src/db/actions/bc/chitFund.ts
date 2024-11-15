import dbClient from "@/db";

const createFund = async (
	name: string,
	fund_amount: number,
	interest_rate: number,
	discount_lsecond: number,
	discount_lthird: number
) => {
	const start_bid = (fund_amount * interest_rate * 12) / 100;

	return dbClient.chitFund.create({
		data: {
			fund_amount,
			interest_rate,
			start_bid,
			name,
			discount_lsecond,
			discount_lthird,
		},
	});
};

const getFundDetails = async (chit_id: number) => {
	const chit_participant_mp = await dbClient.chitFundParticipant.findMany({
		where: {
			chit_id,
		},
	});
	const participant_ids = chit_participant_mp.map((mp) => mp.participant_id);
	console.log(12333, participant_ids);
	const participants = await dbClient.participant.findMany({
		where: {
			participant_id: { in: participant_ids },
		},
	});
	
	console.log(124, participants);
	const fund_details = await dbClient.chitFund.findUnique({
		where: { chit_id },
	});
	return { ...fund_details, participants };
};

const addParticipantToChitFund = async (
	chit_id: number,
	participant_id: number
) =>
	dbClient.chitFundParticipant.create({
		data: {
			chit_id,
			participant_id,
		},
	});

const getAllFunds = async () => dbClient.chitFund.findMany();

const getAllChitParticipants = async (chit_id: number) => {
	//
	const usersIds = await dbClient.chitFundParticipant.findMany({
		where: chit_id,
	});
	console.log({ usersIds });
	const participants = await dbClient.participant.findMany({
		where: {
			participant_id: { in: usersIds },
		},
	});
	console.log({ participants });
	return participants;
};

export {
	createFund,
	getFundDetails,
	addParticipantToChitFund,
	getAllFunds,
	getAllChitParticipants,
};

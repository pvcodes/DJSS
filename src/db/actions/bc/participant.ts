import dbClient from "@/db";

const createParticipant = async (name: string, contact_info: string) => {
	return dbClient.participant.create({
		data: {
			name,
			contact_info,
		},
	});
};

const getParticipantDetails = async (participant_id: number) =>
	dbClient.participant.findUnique({ where: { participant_id } });

const getAllParticipants = async () => dbClient.participant.findMany();

export { createParticipant, getParticipantDetails, getAllParticipants };

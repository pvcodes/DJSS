import dbClient from "@/db";

const getChitFundBidding = async (chit_id: number) => {
	const biddings = await dbClient.bid.findMany({
		where: {
			chit_id,
		},
		orderBy: {
			month: "asc",
		},
	});
	const biddingsByMonth = Object.values(
		biddings.reduce((acc, bidding) => {
			// If the month doesn't exist in the accumulator, create an empty array for it
			if (!acc[bidding.month]) {
				acc[bidding.month] = [];
			}

			// Add the bidding to the appropriate month array
			acc[bidding.month].push(bidding);

			return acc;
		}, {})
	);

	// Sort each month's array by bid_order
	biddingsByMonth.forEach((monthArray) => {
		monthArray.sort((a, b) => a.bid_order - b.bid_order);
	});
	return biddingsByMonth;
};

export { getChitFundBidding };

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."InstallmentStatus" AS ENUM ('PAID', 'PENDING');

-- CreateTable
CREATE TABLE "public"."ChitFund" (
    "chit_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fund_amount" INTEGER NOT NULL,
    "interest_rate" INTEGER NOT NULL,
    "start_bid" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discount_lsecond" INTEGER NOT NULL,
    "discount_lthird" INTEGER NOT NULL,
    "last_bidMonth" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChitFund_pkey" PRIMARY KEY ("chit_id")
);

-- CreateTable
CREATE TABLE "public"."Participant" (
    "participant_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "public"."ChitFundParticipant" (
    "chit_fund_participant_id" SERIAL NOT NULL,
    "chit_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ChitFundParticipant_pkey" PRIMARY KEY ("chit_fund_participant_id")
);

-- CreateTable
CREATE TABLE "public"."Bid" (
    "bid_id" SERIAL NOT NULL,
    "chit_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "bid_amount" INTEGER NOT NULL,
    "bid_order" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("bid_id")
);

-- CreateTable
CREATE TABLE "public"."Installment" (
    "installment_id" SERIAL NOT NULL,
    "chit_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "installment_amount" INTEGER NOT NULL,
    "installment_month" TIMESTAMP(3) NOT NULL,
    "status" "public"."InstallmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("installment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_contact_info_key" ON "public"."Participant"("contact_info");

-- CreateIndex
CREATE UNIQUE INDEX "ChitFundParticipant_chit_id_participant_id_key" ON "public"."ChitFundParticipant"("chit_id", "participant_id");

-- AddForeignKey
ALTER TABLE "public"."ChitFundParticipant" ADD CONSTRAINT "ChitFundParticipant_chit_id_fkey" FOREIGN KEY ("chit_id") REFERENCES "public"."ChitFund"("chit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChitFundParticipant" ADD CONSTRAINT "ChitFundParticipant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."Participant"("participant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_chit_id_fkey" FOREIGN KEY ("chit_id") REFERENCES "public"."ChitFund"("chit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bid" ADD CONSTRAINT "Bid_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."Participant"("participant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Installment" ADD CONSTRAINT "Installment_chit_id_fkey" FOREIGN KEY ("chit_id") REFERENCES "public"."ChitFund"("chit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Installment" ADD CONSTRAINT "Installment_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."Participant"("participant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

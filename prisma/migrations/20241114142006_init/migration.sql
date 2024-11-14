-- CreateTable
CREATE TABLE `ChitFund` (
    `chit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fund_amount` INTEGER NOT NULL,
    `interest_rate` INTEGER NOT NULL,
    `start_bid` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `discount_lsecond` INTEGER NOT NULL,
    `discount_lthird` INTEGER NOT NULL,
    `total_bidcount` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `isLocked` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`chit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participant` (
    `participant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact_info` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Participant_contact_info_key`(`contact_info`),
    PRIMARY KEY (`participant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChitFundParticipant` (
    `chit_fund_participant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chit_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `ChitFundParticipant_chit_id_participant_id_key`(`chit_id`, `participant_id`),
    PRIMARY KEY (`chit_fund_participant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bid` (
    `bid_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chit_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `bid_amount` INTEGER NOT NULL,
    `bid_order` INTEGER NOT NULL,
    `curr_month` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bid_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Installment` (
    `installment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chit_id` INTEGER NOT NULL,
    `participant_id` INTEGER NOT NULL,
    `installment_amount` INTEGER NOT NULL,
    `installment_month` DATETIME(3) NOT NULL,
    `status` ENUM('PAID', 'PENDING') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`installment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChitFundParticipant` ADD CONSTRAINT `ChitFundParticipant_chit_id_fkey` FOREIGN KEY (`chit_id`) REFERENCES `ChitFund`(`chit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChitFundParticipant` ADD CONSTRAINT `ChitFundParticipant_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`participant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_chit_id_fkey` FOREIGN KEY (`chit_id`) REFERENCES `ChitFund`(`chit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`participant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installment` ADD CONSTRAINT `Installment_chit_id_fkey` FOREIGN KEY (`chit_id`) REFERENCES `ChitFund`(`chit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Installment` ADD CONSTRAINT `Installment_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `Participant`(`participant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

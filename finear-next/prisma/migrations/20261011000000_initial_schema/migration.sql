CREATE TABLE `User` (
  `id` VARCHAR(30) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `isVerified` BOOLEAN NOT NULL DEFAULT false,
  `imagePath` VARCHAR(255) NOT NULL DEFAULT 'profile_img.png',
  `verificationOtpHash` VARCHAR(255) NULL,
  `verificationOtpExpiry` DATETIME(3) NULL,
  `resetOtpHash` VARCHAR(255) NULL,
  `resetOtpExpiry` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `User_email_key` (`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Profile` (
  `id` VARCHAR(30) NOT NULL,
  `userId` VARCHAR(30) NOT NULL,
  `handBalance` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `bankBalance` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `flexibleSavings` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `monthlyBudget` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `currency` CHAR(3) NOT NULL DEFAULT 'PKR',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Profile_userId_key` (`userId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Transaction` (
  `id` VARCHAR(30) NOT NULL,
  `userId` VARCHAR(30) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `type` ENUM('income', 'expense', 'savings') NOT NULL,
  `source` ENUM('cash', 'bank') NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'general',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Transaction_userId_createdAt_idx` (`userId`, `createdAt`),
  INDEX `Transaction_userId_type_createdAt_idx` (`userId`, `type`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Goal` (
  `id` VARCHAR(30) NOT NULL,
  `userId` VARCHAR(30) NOT NULL,
  `goalName` VARCHAR(191) NOT NULL,
  `targetAmount` DECIMAL(12, 2) NOT NULL,
  `savedAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `priority` ENUM('high', 'medium', 'low') NOT NULL,
  `status` ENUM('Active', 'Completed') NOT NULL DEFAULT 'Active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Goal_userId_createdAt_idx` (`userId`, `createdAt`),
  INDEX `Goal_userId_status_idx` (`userId`, `status`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Goal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

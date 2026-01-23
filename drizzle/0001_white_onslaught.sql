CREATE TABLE `bidItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bidId` int NOT NULL,
	`description` text NOT NULL,
	`quantity` decimal(10,2) DEFAULT '1',
	`unitPrice` decimal(12,2) NOT NULL,
	`total` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bidItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`projectId` int,
	`bidNumber` varchar(50) NOT NULL,
	`status` enum('draft','sent','viewed','accepted','rejected','expired') DEFAULT 'draft',
	`issueDate` timestamp DEFAULT (now()),
	`expiryDate` timestamp,
	`subtotal` decimal(12,2) DEFAULT '0',
	`taxAmount` decimal(12,2) DEFAULT '0',
	`total` decimal(12,2) DEFAULT '0',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bids_id` PRIMARY KEY(`id`),
	CONSTRAINT `bids_bidNumber_unique` UNIQUE(`bidNumber`)
);
--> statement-breakpoint
CREATE TABLE `businessSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyEmail` varchar(320),
	`companyPhone` varchar(20),
	`companyAddress` text,
	`taxRate` decimal(5,2) DEFAULT '0',
	`paymentTerms` varchar(100),
	`invoicePrefix` varchar(10) DEFAULT 'INV',
	`bidPrefix` varchar(10) DEFAULT 'BID',
	`nextInvoiceNumber` int DEFAULT 1001,
	`nextBidNumber` int DEFAULT 1001,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businessSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`zipCode` varchar(20),
	`country` varchar(100),
	`taxId` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoiceItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` int NOT NULL,
	`description` text NOT NULL,
	`quantity` decimal(10,2) DEFAULT '1',
	`unitPrice` decimal(12,2) NOT NULL,
	`total` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoiceItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`projectId` int,
	`invoiceNumber` varchar(50) NOT NULL,
	`status` enum('draft','sent','viewed','partially_paid','paid','overdue','cancelled') DEFAULT 'draft',
	`issueDate` timestamp DEFAULT (now()),
	`dueDate` timestamp,
	`subtotal` decimal(12,2) DEFAULT '0',
	`taxAmount` decimal(12,2) DEFAULT '0',
	`total` decimal(12,2) DEFAULT '0',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `jobCosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`amount` decimal(12,2) NOT NULL,
	`costDate` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobCosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`type` varchar(50),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`invoiceId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`paymentMethod` enum('card','cash','check','bank_transfer','other') NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`transactionId` varchar(100),
	`notes` text,
	`paymentDate` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('planning','in_progress','on_hold','completed','cancelled') DEFAULT 'planning',
	`startDate` timestamp,
	`endDate` timestamp,
	`budget` decimal(12,2),
	`progress` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurringInvoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`projectId` int,
	`name` varchar(255) NOT NULL,
	`frequency` enum('weekly','biweekly','monthly','quarterly','yearly') NOT NULL,
	`status` enum('active','paused','cancelled') DEFAULT 'active',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`subtotal` decimal(12,2) DEFAULT '0',
	`taxAmount` decimal(12,2) DEFAULT '0',
	`total` decimal(12,2) DEFAULT '0',
	`nextInvoiceDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurringInvoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`role` varchar(100),
	`hourlyRate` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('invoice','bid','proposal') NOT NULL,
	`content` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`description` text,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`duration` int,
	`hourlyRate` decimal(10,2),
	`totalCost` decimal(12,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`description` text,
	`eventDate` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_bidId` ON `bidItems` (`bidId`);--> statement-breakpoint
CREATE INDEX `idx_userId_bids` ON `bids` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_clientId_bids` ON `bids` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_userId` ON `businessSettings` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_userId_clients` ON `clients` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_invoiceId` ON `invoiceItems` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `idx_userId_invoices` ON `invoices` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_clientId_invoices` ON `invoices` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_userId_jobCosts` ON `jobCosts` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_projectId_jobCosts` ON `jobCosts` (`projectId`);--> statement-breakpoint
CREATE INDEX `idx_userId_notifications` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_userId_payments` ON `payments` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_invoiceId_payments` ON `payments` (`invoiceId`);--> statement-breakpoint
CREATE INDEX `idx_userId_photos` ON `photos` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_projectId_photos` ON `photos` (`projectId`);--> statement-breakpoint
CREATE INDEX `idx_userId_projects` ON `projects` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_clientId` ON `projects` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_userId_recurring` ON `recurringInvoices` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_clientId_recurring` ON `recurringInvoices` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_userId_teamMembers` ON `teamMembers` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_userId_templates` ON `templates` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_userId_timeEntries` ON `timeEntries` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_projectId_timeEntries` ON `timeEntries` (`projectId`);--> statement-breakpoint
CREATE INDEX `idx_userId_timeline` ON `timeline` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_projectId_timeline` ON `timeline` (`projectId`);
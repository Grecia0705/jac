-- CreateTable
CREATE TABLE "App" (
    "appId" TEXT NOT NULL PRIMARY KEY,
    "mount_total" REAL NOT NULL,
    "app_name" TEXT NOT NULL DEFAULT 'Fotocopia'
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" BOOLEAN NOT NULL DEFAULT false,
    "rol" TEXT NOT NULL DEFAULT 'ADMIN',
    "createBy" TEXT,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Machine" (
    "machineId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Machine_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Product_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rawmater" (
    "rawmatterId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createId" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "gr" INTEGER NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Rawmater_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Control" (
    "controlId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "kg" INTEGER NOT NULL,
    "gr" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "rawmatterId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Stock" (
    "stockId" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Stock_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "mount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "TransactionCategory" (
    "transactionCategoryId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TransactionCategory_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransactionType" (
    "transactionTypeId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createId" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TransactionType_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

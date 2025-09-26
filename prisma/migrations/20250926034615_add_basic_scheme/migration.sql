-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MANAGEMENT', 'LAW', 'INTERNAL');

-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "oauthProvider" TEXT,
    "oauthId" TEXT,
    "role" "public"."UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "parties" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "public"."ContractStatus" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrl" TEXT NOT NULL,
    "contractData" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIContractDraft" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AIContractDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContractValidation" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "mandatoryElems" JSONB NOT NULL,
    "riskDetected" JSONB NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractValidation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIContractDraft" ADD CONSTRAINT "AIContractDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractValidation" ADD CONSTRAINT "ContractValidation_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."Query" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadingLog" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL,
 "bookTitle" VARCHAR(80) NOT NULL, "minutesRead" INTEGER NOT NULL,
 "genre" TEXT NOT NULL, "note" TEXT NOT NULL DEFAULT '',
 "favorite" BOOLEAN NOT NULL DEFAULT false, "readOn" VARCHAR(10) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "ReadingLog_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "ReadingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ReadingLog_userId_bookTitle_minutesRead_readOn_key" ON "ReadingLog"("userId", "bookTitle", "minutesRead", "readOn");
CREATE INDEX "ReadingLog_userId_readOn_idx" ON "ReadingLog"("userId", "readOn");

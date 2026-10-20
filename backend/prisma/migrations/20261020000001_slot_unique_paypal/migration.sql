-- AlterTable: add paypalOrderId
ALTER TABLE "Reservation" ADD COLUMN "paypalOrderId" TEXT;

-- CreateIndex: unique paypalOrderId
CREATE UNIQUE INDEX "Reservation_paypalOrderId_key" ON "Reservation"("paypalOrderId");

-- CreateIndex: unique (date, time) — un seul RDV par créneau
CREATE UNIQUE INDEX "Reservation_date_time_key" ON "Reservation"("date", "time");

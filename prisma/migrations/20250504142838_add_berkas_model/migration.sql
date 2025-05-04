-- CreateTable
CREATE TABLE "Berkas" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "jenisFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berkas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Berkas" ADD CONSTRAINT "Berkas_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

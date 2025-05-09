-- CreateTable
CREATE TABLE "CalonSiswa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalonSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "calonSiswaId" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "tk" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "agama" TEXT NOT NULL,
    "hobi" TEXT NOT NULL,
    "namaSekolah" TEXT NOT NULL,
    "statusSekolahAsal" TEXT NOT NULL,
    "alamatSekolah" TEXT NOT NULL,
    "namaWali" TEXT NOT NULL,
    "ttlWali" TEXT NOT NULL,
    "pekerjaanWali" TEXT NOT NULL,
    "pendapatanWali" TEXT NOT NULL,
    "noRumah" TEXT NOT NULL,
    "berkasId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berkas" (
    "id" SERIAL NOT NULL,
    "dokumenPersyaratan" TEXT NOT NULL,
    "calonSiswaId" TEXT NOT NULL,

    CONSTRAINT "Berkas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" SERIAL NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileContent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfoPendaftaranContent" (
    "id" SERIAL NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brosurUrl" TEXT,
    "googleDocUrl" TEXT,
    "daftarUrl" TEXT,

    CONSTRAINT "InfoPendaftaranContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profil" (
    "id" SERIAL NOT NULL,
    "tentang" TEXT NOT NULL,
    "visi" TEXT NOT NULL,
    "misi" TEXT NOT NULL,
    "kepalaMadrasah" TEXT,
    "sambutan" TEXT,
    "keunggulan" TEXT,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalonSiswa_nisn_key" ON "CalonSiswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Form_berkasId_key" ON "Form"("berkasId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_name_key" ON "Admin"("name");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_berkasId_fkey" FOREIGN KEY ("berkasId") REFERENCES "Berkas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_calonSiswaId_fkey" FOREIGN KEY ("calonSiswaId") REFERENCES "CalonSiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Berkas" ADD CONSTRAINT "Berkas_calonSiswaId_fkey" FOREIGN KEY ("calonSiswaId") REFERENCES "CalonSiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import ImageViewer from "../ImageViewer";
import { Property } from "@/types/property";

interface PropertyGalleryProps {
  images: string[];
  property?: Property;
  type?: 'sale' | 'rent';
}

export default function PropertyGallery({ images, property, type }: PropertyGalleryProps) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  const normalizeTurkish = (text: string): string => {
    return text
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .replace(/Ğ/g, 'G')
      .replace(/ğ/g, 'g')
      .replace(/Ü/g, 'U')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 'S')
      .replace(/ş/g, 's')
      .replace(/Ö/g, 'O')
      .replace(/ö/g, 'o')
      .replace(/Ç/g, 'C')
      .replace(/ç/g, 'c');
  };

  const handleExportPDF = useCallback(async () => {
    if (!property) return;

    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Logo
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          setTimeout(() => reject(new Error('Logo timeout')), 3000);
          logoImg.src = '/pdflogo/logo.png';
        });
        pdf.addImage(logoImg, 'PNG', margin, yPos, 80, 23);
        yPos += 30;
      } catch (error) {
        console.warn('Logo yüklenemedi', error);
        yPos += 10;
      }

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const title = normalizeTurkish(property.title);
      const titleLines = pdf.splitTextToSize(title, contentWidth);
      pdf.text(titleLines, margin, yPos);
      yPos += titleLines.length * 7 + 5;

      // Location & Price
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const location = `${property.location.city}, ${property.location.country}`;
      pdf.text(normalizeTurkish(location), margin, yPos);
      yPos += 6;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 120, 0);
      pdf.text(`${property.price.toLocaleString('tr-TR')} TL`, margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += 10;

      // Main Image
      if (images && images.length > 0) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(() => reject(new Error('Image timeout')), 5000);
            img.src = images[0];
          });
          const imgWidth = contentWidth;
          const imgHeight = (imgWidth * 3) / 4;
          
          if (yPos + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          
          pdf.addImage(img, 'JPEG', margin, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        } catch (error) {
          console.warn('Görsel yüklenemedi', error);
        }
      }

      // Description
      if (property.description) {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = margin;
        }
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(normalizeTurkish('Aciklama'), margin, yPos);
        yPos += 7;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(normalizeTurkish(property.description), contentWidth);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 5 + 10;
      }

      // Image Catalog
      if (images && images.length > 1) {
        pdf.addPage();
        yPos = margin;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(normalizeTurkish('Tum Gorseller'), margin, yPos);
        yPos += 10;

        const imagesPerRow = 2;
        const imageWidth = (contentWidth - 10) / imagesPerRow;
        const imageHeight = 60;
        let col = 0;

        for (let i = 0; i < images.length; i++) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              setTimeout(() => reject(new Error('Timeout')), 3000);
              img.src = images[i];
            });

            const xPos = margin + col * (imageWidth + 10);

            if (yPos + imageHeight > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
              col = 0;
            }

            pdf.addImage(img, 'JPEG', xPos, yPos, imageWidth, imageHeight);

            col++;
            if (col >= imagesPerRow) {
              col = 0;
              yPos += imageHeight + 10;
            }
          } catch (error) {
            console.warn(`Görsel ${i + 1} yüklenemedi`, error);
          }
        }
      }

      // Footer
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        const footerText = normalizeTurkish(`IREMWORLD - ${new Date().toLocaleDateString('tr-TR')} - Sayfa ${i}/${totalPages}`);
        pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      const fileName = normalizeTurkish(`${property.title}.pdf`);
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    }
  }, [property, images]);

  const handlePrint = useCallback(() => {
    if (!property) return;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Lütfen popup engelleyiciyi kapatın ve tekrar deneyin.');
      return;
    }

    const location = `${property.location.city}, ${property.location.country}`;

    let catalogHTML = '';
    if (images && images.length > 0) {
      catalogHTML = `
        <div class="catalog-page">
          <h2>Tüm Görseller</h2>
          <div class="catalog-grid">
            ${images.map((img, idx) => `
              <div class="catalog-image-container">
                <img src="${img}" alt="${property.title} - Görsel ${idx + 1}" class="catalog-image" onerror="this.style.display='none'">
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${property.title} - IREMWORLD</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: white;
            color: #111827;
            font-size: 12px;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
          }
          .logo {
            width: 180px;
            height: auto;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #111827;
          }
          .location {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 6px;
          }
          .price {
            font-size: 20px;
            font-weight: bold;
            color: #059669;
            margin-top: 8px;
          }
          .property-image {
            width: 100%;
            max-height: 400px;
            border-radius: 12px;
            overflow: hidden;
            margin: 20px 0;
            background: #f3f4f6;
          }
          .property-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .description {
            font-size: 11px;
            color: #4b5563;
            line-height: 1.6;
            margin: 15px 0;
          }
          .catalog-page {
            page-break-before: always;
            margin-top: 20px;
            padding-top: 20px;
          }
          h2 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 6px;
          }
          .catalog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 15px;
          }
          .catalog-image-container {
            border-radius: 8px;
            overflow: hidden;
            background: #f3f4f6;
            height: 200px;
          }
          .catalog-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @media print {
            body {
              padding: 10mm;
            }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            .catalog-page {
              page-break-before: always;
            }
            @page {
              margin-bottom: 0;
            }
            body::after {
              content: "";
              display: block;
              height: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/pdflogo/logo.png" alt="IREMWORLD" class="logo" onerror="this.style.display='none'">
          <h1>${property.title}</h1>
          <p class="location">${location}</p>
          <p class="price">${property.price.toLocaleString('tr-TR')} ₺</p>
        </div>

        ${images && images.length > 0 ? `
          <div class="property-image">
            <img src="${images[0]}" alt="${property.title}" onerror="this.style.display='none'">
          </div>
        ` : ''}

        ${property.description ? `
          <div class="section">
            <h2>Açıklama</h2>
            <p class="description">${property.description}</p>
          </div>
        ` : ''}

        ${catalogHTML}

        <script>
          window.onload = function() {
            document.title = '${property.title} - IREMWORLD';
            setTimeout(function() {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  }, [property, images]);

  if (!images || images.length === 0) {
    return null;
  }

  const accentImages = images.slice(1, 5);
  const topRightImage = accentImages[0];
  const bottomImages = accentImages.slice(1);
  const remainingImageCount = Math.max(images.length - (1 + accentImages.length), 0);

  return (
    <section className="relative z-10 -mt-16 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-[32px] border border-slate-200/60 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Galeri
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Mekanı Yakından Keşfedin
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={!property}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-red-600 to-red-700 px-5 py-2 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF İndir</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!property}
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-all hover:border-slate-900/30 hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Yazdır</span>
              </button>
            </div>
          </div>

          <div className="grid gap-3 px-6 pb-6 lg:grid-cols-[2fr_1fr]">
            <button
              type="button"
              className="group relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-slate-100"
              onClick={() => openImage(0)}
            >
              <Image
                src={images[0]}
                alt="Ana mülk görseli"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-white backdrop-blur">
                Galeriyi Aç
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <div className="grid gap-3">
              {topRightImage && (
                <button
                  type="button"
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100"
                  onClick={() => openImage(1)}
                >
                  <Image
                    src={topRightImage}
                    alt="Mülk görseli"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/20" />
                </button>
              )}

              {bottomImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {bottomImages.map((image, index) => {
                    const absoluteIndex = index + 2;
                    const showRemainingBadge = index === bottomImages.length - 1 && remainingImageCount > 0;

                    return (
                      <button
                        key={image}
                        type="button"
                        className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100"
                        onClick={() => openImage(absoluteIndex)}
                      >
                        <Image
                          src={image}
                          alt="Mülk görseli"
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                        {showRemainingBadge && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white backdrop-blur">
                            <span className="text-sm font-semibold">+{remainingImageCount}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </section>
  );
}

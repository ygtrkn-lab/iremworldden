"use client";

import { useEffect, useState, useCallback } from "react";
import { Property } from "@/types/property";
import { formatLocation } from "@/lib/client-utils";

interface PropertyContentProps {
	property: Property;
	type: "sale" | "rent";
	isVisible: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" });

const buildTagList = (features: Array<{ label: string; condition?: boolean }>) =>
	features.filter((feature) => feature.condition).map((feature) => feature.label);

const formatCurrency = (value?: number | null) =>
	typeof value === "number" ? `${value.toLocaleString("tr-TR")} ₺` : null;

export default function PropertyContent({
	property,
	type,
	isVisible,
}: PropertyContentProps) {
	const [currentUrl, setCurrentUrl] = useState("");
	const [shareFeedback, setShareFeedback] = useState<"copied" | "error" | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setCurrentUrl(window.location.href);
		}
	}, []);

	const animateClass = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
	const locationText = formatLocation(property.location);
	const isLand = property.category.main === "Arsa";

	const highlightMetrics: Array<{ label: string; value: string }> = [];

	if (property.specs?.rooms) {
		highlightMetrics.push({ label: "Oda Planı", value: property.specs.rooms });
	}

	if (typeof property.specs?.netSize === "number") {
		highlightMetrics.push({
			label: "Net Alan",
			value: `${property.specs.netSize.toLocaleString("tr-TR")} m²`,
		});
	}

	if (typeof property.specs?.bathrooms === "number") {
		highlightMetrics.push({ label: "Banyo", value: property.specs.bathrooms.toString() });
	}

	if (typeof property.specs?.age === "number") {
		highlightMetrics.push({ label: "Bina Yaşı", value: `${property.specs.age} yıl` });
	}

	if (highlightMetrics.length < 4 && property.specs?.heating) {
		highlightMetrics.push({ label: "Isıtma", value: property.specs.heating });
	}

	const technicalSpecs = isLand
		? []
		: ([
				property.specs?.furnishing && {
					label: "Eşya Durumu",
					value: property.specs.furnishing,
				},
				typeof property.specs?.grossSize === "number" && {
					label: "Brüt Alan",
					value: `${property.specs.grossSize.toLocaleString("tr-TR")} m²`,
				},
				typeof property.specs?.balconyCount === "number" && {
					label: "Balkon",
					value: property.specs.balconyCount.toString(),
				},
				typeof property.specs?.floor === "number" && {
					label: "Bulunduğu Kat",
					value: property.specs.floor === 0 ? "Zemin" : `${property.specs.floor}. Kat`,
				},
				typeof property.specs?.totalFloors === "number" && {
					label: "Toplam Kat",
					value: property.specs.totalFloors.toString(),
				},
			].filter(Boolean) as Array<{ label: string; value: string }>);

	const landInsights = property.landDetails
		? ([
				property.landDetails.zoningStatus && {
					label: "İmar Durumu",
					value: property.landDetails.zoningStatus,
				},
				typeof property.specs?.netSize === "number" && {
					label: "Parsel Büyüklüğü",
					value: `${property.specs.netSize.toLocaleString("tr-TR")} m²`,
				},
				typeof property.landDetails.pricePerSquareMeter === "number" && {
					label: "m² Fiyatı",
					value: `${property.landDetails.pricePerSquareMeter.toLocaleString("tr-TR")} ₺`,
				},
				property.landDetails.creditEligibility && {
					label: "Krediye Uygunluk",
					value: property.landDetails.creditEligibility,
				},
				property.landDetails.blockNumber && {
					label: "Ada No",
					value: property.landDetails.blockNumber,
				},
				property.landDetails.parcelNumber && {
					label: "Parsel No",
					value: property.landDetails.parcelNumber,
				},
				property.landDetails.sheetNumber && {
					label: "Pafta No",
					value: property.landDetails.sheetNumber,
				},
			].filter(Boolean) as Array<{ label: string; value: string }>)
		: [];

	const managementHighlights: Array<{ label: string; value: string }> = [];

	if (property.propertyDetails.usageStatus) {
		managementHighlights.push({
			label: "Kullanım Durumu",
			value: property.propertyDetails.usageStatus,
		});
	}

	if (property.propertyDetails.deedStatus) {
		managementHighlights.push({
			label: "Tapu Durumu",
			value: property.propertyDetails.deedStatus,
		});
	}

	if (property.propertyDetails.fromWho) {
		managementHighlights.push({
			label: "Kimden",
			value: property.propertyDetails.fromWho,
		});
	}

	if (typeof property.propertyDetails.monthlyFee === "number") {
		managementHighlights.push({
			label: "Aidat",
			value: `${property.propertyDetails.monthlyFee.toLocaleString("tr-TR")} ₺`,
		});
	}

	managementHighlights.push({
		label: "Kredi Durumu",
		value: property.propertyDetails.creditEligible ? "Krediye Uygun" : "Krediye Uygun Değil",
	});

	managementHighlights.push({
		label: "İskan",
		value: property.propertyDetails.isSettlement ? "Var" : "Yok",
	});

	managementHighlights.push({
		label: "Borç Durumu",
		value: property.propertyDetails.hasDebt
			? property.propertyDetails.debtAmount
				? `Var • ${property.propertyDetails.debtAmount.toLocaleString("tr-TR")} ₺`
				: "Var"
			: "Yok",
	});

	if (property.propertyDetails.isRentGuaranteed) {
		managementHighlights.push({
			label: "Kira Garantisi",
			value: property.propertyDetails.rentGuaranteeAmount
				? `${property.propertyDetails.rentGuaranteeAmount.toLocaleString("tr-TR")} ₺`
				: "Var",
		});
	}

	const managementTags = buildTagList([
		{ label: "Takas Uygun", condition: property.propertyDetails?.exchangeAvailable },
		{ label: "Site İçerisinde", condition: property.propertyDetails?.inSite },
		{ label: "Yeni İnşa", condition: property.propertyDetails?.isNewBuilding },
		{ label: "Kira Garantili", condition: property.propertyDetails?.isRentGuaranteed },
		{ label: "Ofise Uygun", condition: property.propertyDetails?.isSuitableForOffice },
		{ label: "İşyeri Ruhsatlı", condition: property.propertyDetails?.hasBusinessLicense },
	]);

	const interiorTags = property.interiorFeatures
		? buildTagList([
				{ label: "Ankastre Mutfak", condition: property.interiorFeatures.hasBuiltInKitchen },
				{ label: "Gömme Dolap", condition: property.interiorFeatures.hasBuiltInWardrobe },
				{ label: "Spot Aydınlatma", condition: property.interiorFeatures.hasSpotLighting },
				{ label: "Hilton Banyo", condition: property.interiorFeatures.hasHiltonBathroom },
				{ label: "Çelik Kapı", condition: property.interiorFeatures.hasSteelDoor },
				{ label: "Görüntülü Diafon", condition: property.interiorFeatures.hasIntercom },
			])
		: [];

	const exteriorTags = property.exteriorFeatures
		? buildTagList([
				{ label: "Balkon", condition: property.exteriorFeatures.hasBalcony },
				{ label: "Teras", condition: property.exteriorFeatures.hasTerrace },
				{ label: "Bahçe", condition: property.exteriorFeatures.hasGarden },
				{ label: "Deniz Manzarası", condition: property.exteriorFeatures.hasSeaView },
				{ label: "Doğa Manzarası", condition: property.exteriorFeatures.hasNatureView },
				{ label: "Havuz Manzarası", condition: property.exteriorFeatures.hasPoolView },
			])
		: [];

	const buildingTags = property.buildingFeatures
		? buildTagList([
				{ label: "Asansör", condition: property.buildingFeatures.hasElevator },
				{ label: "Kapalı Otopark", condition: property.buildingFeatures.hasClosedCarPark },
				{ label: "24 Saat Güvenlik", condition: property.buildingFeatures.has24HourSecurity },
				{ label: "Kamera Sistemi", condition: property.buildingFeatures.hasCameraSystem },
				{ label: "Spor Salonu", condition: property.buildingFeatures.hasGym },
				{ label: "Türk Hamamı", condition: property.buildingFeatures.hasTurkishBath },
				{ label: "Jeneratör", condition: property.buildingFeatures.hasGenerator },
				{ label: "Su Deposu", condition: property.buildingFeatures.hasWaterBooster },
				{ label: "Kablosuz İnternet", condition: property.buildingFeatures.hasWifi },
			])
		: [];

	const timeline = ([
		property.createdAt && {
			label: "İlk Yayınlanma",
			value: dateFormatter.format(new Date(property.createdAt)),
		},
		property.updatedAt && {
			label: "Son Güncelleme",
			value: dateFormatter.format(new Date(property.updatedAt)),
		},
		typeof property.viewCount === "number" && {
			label: "Görüntülenme",
			value: property.viewCount.toLocaleString("tr-TR"),
		},
	].filter(Boolean) as Array<{ label: string; value: string }>);

	const externalLinks = ([
		property.sahibindenLink && {
			label: "Sahibinden.com",
			href: property.sahibindenLink,
		},
		property.hurriyetEmlakLink && {
			label: "Hürriyet Emlak",
			href: property.hurriyetEmlakLink,
		},
		property.emlakJetLink && {
			label: "EmlakJet",
			href: property.emlakJetLink,
		},
	].filter(Boolean) as Array<{ label: string; href: string }>);

	const locationDetails = ([
		property.location.country && {
			label: "Ülke",
			value: property.location.country,
		},
		property.location.state && {
			label: "Eyalet/İl",
			value: property.location.state,
		},
		property.location.city && {
			label: "Şehir",
			value: property.location.city,
		},
		property.location.district && {
			label: "İlçe",
			value: property.location.district,
		},
		property.location.neighborhood && {
			label: "Mahalle",
			value: property.location.neighborhood,
		},
		property.location.address && {
			label: "Adres",
			value: property.location.address,
		},
	].filter(Boolean) as Array<{ label: string; value: string }>);

	const agentInitials = property.agent.name
		.split(" ")
		.map((part) => part.charAt(0))
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const handleShare = async () => {
		try {
			if (typeof window === "undefined") {
				return;
			}

			const shareData: ShareData = {
				title: property.title,
				text: `${property.title} • ${locationText}`,
				url: currentUrl || window.location.href,
			};

			if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
				await navigator.share(shareData);
				return;
			}

			if (typeof navigator !== "undefined" && navigator.clipboard) {
				// Fallback to clipboard when native share is unavailable.
				await navigator.clipboard.writeText(shareData.url ?? "");
				setShareFeedback("copied");
				setTimeout(() => setShareFeedback(null), 2500);
			}
		} catch (error) {
			console.error("Share failed", error);
			setShareFeedback("error");
			setTimeout(() => setShareFeedback(null), 2500);
		}
	};

	const shareButtonLabel =
		shareFeedback === "copied" ? "Bağlantı kopyalandı" : shareFeedback === "error" ? "Tekrar Dene" : "İlanı Paylaş";

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
				console.warn('Logo yüklenemedi, atlanıyor', error);
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
			pdf.text(normalizeTurkish(locationText), margin, yPos);
			yPos += 6;

			pdf.setFontSize(16);
			pdf.setFont('helvetica', 'bold');
			pdf.setTextColor(0, 120, 0);
			pdf.text(`${property.price.toLocaleString('tr-TR')} TL`, margin, yPos);
			pdf.setTextColor(0, 0, 0);
			yPos += 10;

			// Property Image
			if (property.images && property.images.length > 0) {
				try {
					const img = new Image();
					img.crossOrigin = 'anonymous';
					await new Promise((resolve, reject) => {
						img.onload = resolve;
						img.onerror = reject;
						setTimeout(() => reject(new Error('Image timeout')), 5000);
						img.src = property.images[0];
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

			// Highlight Metrics
			if (highlightMetrics.length > 0) {
				if (yPos > pageHeight - 40) {
					pdf.addPage();
					yPos = margin;
				}

				pdf.setFontSize(12);
				pdf.setFont('helvetica', 'bold');
				pdf.text(normalizeTurkish('Ozellikler'), margin, yPos);
				yPos += 7;

				const metricsData = highlightMetrics.map(m => [
					normalizeTurkish(m.label),
					normalizeTurkish(m.value)
				]);

				(pdf as any).autoTable({
					startY: yPos,
					head: [],
					body: metricsData,
					margin: { left: margin, right: margin },
					theme: 'grid',
					styles: { font: 'helvetica', fontSize: 10 },
					headStyles: { fillColor: [15, 23, 42] },
					alternateRowStyles: { fillColor: [249, 250, 251] },
				});

				yPos = (pdf as any).lastAutoTable.finalY + 10;
			}

			// Technical Specs
			if (!isLand && technicalSpecs.length > 0) {
				if (yPos > pageHeight - 40) {
					pdf.addPage();
					yPos = margin;
				}

				pdf.setFontSize(12);
				pdf.setFont('helvetica', 'bold');
				pdf.text(normalizeTurkish('Teknik Ozellikler'), margin, yPos);
				yPos += 7;

				const techData = technicalSpecs.map(s => [
					normalizeTurkish(s.label),
					normalizeTurkish(s.value)
				]);

				(pdf as any).autoTable({
					startY: yPos,
					head: [],
					body: techData,
					margin: { left: margin, right: margin },
					theme: 'grid',
					styles: { font: 'helvetica', fontSize: 10 },
					headStyles: { fillColor: [15, 23, 42] },
					alternateRowStyles: { fillColor: [249, 250, 251] },
				});

				yPos = (pdf as any).lastAutoTable.finalY + 10;
			}

			// Management Highlights
			if (managementHighlights.length > 0) {
				if (yPos > pageHeight - 40) {
					pdf.addPage();
					yPos = margin;
				}

				pdf.setFontSize(12);
				pdf.setFont('helvetica', 'bold');
				pdf.text(normalizeTurkish('Yonetim & Finans'), margin, yPos);
				yPos += 7;

				const mgmtData = managementHighlights.map(m => [
					normalizeTurkish(m.label),
					normalizeTurkish(m.value)
				]);

				(pdf as any).autoTable({
					startY: yPos,
					head: [],
					body: mgmtData,
					margin: { left: margin, right: margin },
					theme: 'grid',
					styles: { font: 'helvetica', fontSize: 10 },
					headStyles: { fillColor: [15, 23, 42] },
					alternateRowStyles: { fillColor: [249, 250, 251] },
				});

				yPos = (pdf as any).lastAutoTable.finalY + 10;
			}

			// Location Details
			if (locationDetails.length > 0) {
				if (yPos > pageHeight - 40) {
					pdf.addPage();
					yPos = margin;
				}

				pdf.setFontSize(12);
				pdf.setFont('helvetica', 'bold');
				pdf.text(normalizeTurkish('Konum Bilgileri'), margin, yPos);
				yPos += 7;

				const locData = locationDetails.map(l => [
					normalizeTurkish(l.label),
					normalizeTurkish(l.value)
				]);

				(pdf as any).autoTable({
					startY: yPos,
					head: [],
					body: locData,
					margin: { left: margin, right: margin },
					theme: 'grid',
					styles: { font: 'helvetica', fontSize: 10 },
					headStyles: { fillColor: [15, 23, 42] },
					alternateRowStyles: { fillColor: [249, 250, 251] },
				});

				yPos = (pdf as any).lastAutoTable.finalY + 10;
			}

			// Image Catalog
			if (property.images && property.images.length > 1) {
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

				for (let i = 1; i < property.images.length; i++) {
					try {
						const img = new Image();
						img.crossOrigin = 'anonymous';
						await new Promise((resolve, reject) => {
							img.onload = resolve;
							img.onerror = reject;
							setTimeout(() => reject(new Error('Timeout')), 3000);
							img.src = property.images[i];
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
	}, [property, locationText, highlightMetrics, technicalSpecs, managementHighlights, locationDetails, isLand]);

	const handlePrint = useCallback((event?: React.MouseEvent) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		const printWindow = window.open('', '_blank', 'width=1200,height=800');
		if (!printWindow) {
			alert('Lütfen popup engelleyiciyi kapatın ve tekrar deneyin.');
			return;
		}

		// Build property details HTML
		let highlightHTML = '';
		if (highlightMetrics.length > 0) {
			highlightHTML = `
				<div class="section">
					<h2>Özellikler</h2>
					<div class="metrics-grid">
						${highlightMetrics.map(m => `
							<div class="metric-item">
								<div class="metric-label">${m.label}</div>
								<div class="metric-value">${m.value}</div>
							</div>
						`).join('')}
					</div>
				</div>
			`;
		}

		let technicalHTML = '';
		if (!isLand && technicalSpecs.length > 0) {
			technicalHTML = `
				<div class="section">
					<h2>Teknik Özellikler</h2>
					<div class="details-grid">
						${technicalSpecs.map(s => `
							<div class="detail-row">
								<span class="detail-label">${s.label}</span>
								<span class="detail-value">${s.value}</span>
							</div>
						`).join('')}
					</div>
				</div>
			`;
		}

		let managementHTML = '';
		if (managementHighlights.length > 0) {
			managementHTML = `
				<div class="section">
					<h2>Yönetim & Finans</h2>
					<div class="details-grid">
						${managementHighlights.map(m => `
							<div class="detail-row">
								<span class="detail-label">${m.label}</span>
								<span class="detail-value">${m.value}</span>
							</div>
						`).join('')}
					</div>
				</div>
			`;
		}

		let locationHTML = '';
		if (locationDetails.length > 0) {
			locationHTML = `
				<div class="section">
					<h2>Konum Bilgileri</h2>
					<div class="details-grid">
						${locationDetails.map(l => `
							<div class="detail-row">
								<span class="detail-label">${l.label}</span>
								<span class="detail-value">${l.value}</span>
							</div>
						`).join('')}
					</div>
				</div>
			`;
		}

		let catalogHTML = '';
		if (property.images && property.images.length > 0) {
			catalogHTML = `
				<div class="catalog-page">
					<h2>Tüm Görseller</h2>
					<div class="catalog-grid">
						${property.images.map((img, idx) => `
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
					.section {
						margin: 20px 0;
						page-break-inside: avoid;
					}
					h2 {
						font-size: 16px;
						font-weight: 600;
						margin-bottom: 12px;
						color: #111827;
						border-bottom: 1px solid #e5e7eb;
						padding-bottom: 6px;
					}
					.description {
						font-size: 11px;
						color: #4b5563;
						line-height: 1.6;
						margin: 15px 0;
					}
					.metrics-grid {
						display: grid;
						grid-template-columns: repeat(4, 1fr);
						gap: 12px;
					}
					.metric-item {
						border: 1px solid #e5e7eb;
						border-radius: 8px;
						padding: 10px;
						text-align: center;
					}
					.metric-label {
						font-size: 9px;
						color: #6b7280;
						text-transform: uppercase;
						letter-spacing: 0.05em;
						margin-bottom: 4px;
					}
					.metric-value {
						font-size: 14px;
						font-weight: 600;
						color: #111827;
					}
					.details-grid {
						display: grid;
						grid-template-columns: repeat(2, 1fr);
						gap: 8px;
					}
					.detail-row {
						display: flex;
						justify-content: space-between;
						padding: 8px 0;
						border-bottom: 1px solid #f3f4f6;
					}
					.detail-label {
						font-size: 10px;
						color: #6b7280;
						font-weight: 500;
					}
					.detail-value {
						font-size: 11px;
						color: #111827;
						font-weight: 600;
					}
					.catalog-page {
						page-break-before: always;
						margin-top: 20px;
						padding-top: 20px;
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
					<p class="location">${locationText}</p>
					<p class="price">${property.price.toLocaleString('tr-TR')} ₺</p>
				</div>

				${property.images && property.images.length > 0 ? `
					<div class="property-image">
						<img src="${property.images[0]}" alt="${property.title}" onerror="this.style.display='none'">
					</div>
				` : ''}

				${property.description ? `
					<div class="section">
						<h2>Açıklama</h2>
						<p class="description">${property.description}</p>
					</div>
				` : ''}

				${highlightHTML}
				${technicalHTML}
				${managementHTML}
				${locationHTML}
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
	}, [property, locationText, highlightMetrics, technicalSpecs, managementHighlights, locationDetails, isLand]);

	return (
		<section id="property-content" className="relative isolate bg-white pb-24 pt-8">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
			<div className={`mx-auto max-w-6xl px-4 transition-all duration-700 ease-out ${animateClass}`}>
				{/* PDF ve Print Butonları - Mobilde üstte */}
				<div className="mb-6 lg:hidden">
					<div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur">
						<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">İşlemler</h3>
						<div className="mt-4 flex gap-3">
							<button
								type="button"
								onClick={handleExportPDF}
								className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 shadow-sm hover:shadow active:scale-95"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								PDF İndir
							</button>
							<button
								type="button"
								onClick={handlePrint}
								className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:border-slate-900/30 hover:bg-slate-900/5"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
								</svg>
								Yazdır
							</button>
						</div>
					</div>
				</div>

				<div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
					<div className="space-y-10">
						<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-xl backdrop-blur-xl">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Öne Çıkanlar</p>
									<h2 className="mt-3 text-2xl font-semibold text-slate-900">Mülk Hakkında</h2>
								</div>
								<span className="rounded-full border border-slate-200/60 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
									{type === "rent" ? "Kiralık" : "Satılık"}
								</span>
							</div>

							<p className="mt-6 text-base leading-relaxed text-slate-600">
								{property.description}
							</p>

							{highlightMetrics.length > 0 && (
								<div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
									{highlightMetrics.map((metric) => (
										<div
											key={metric.label}
											className="rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm"
										>
											<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
												{metric.label}
											</p>
											<p className="mt-2 text-lg font-semibold text-slate-900">{metric.value}</p>
										</div>
									))}
								</div>
							)}
						</div>

						{!isLand && technicalSpecs.length > 0 && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<div className="flex items-center justify-between gap-3">
									<h3 className="text-xl font-semibold text-slate-900">Teknik Özellikler</h3>
									{property.specs?.heating && (
										<span className="rounded-full bg-slate-900/5 px-4 py-1 text-xs font-medium text-slate-500">
											{property.specs.heating}
										</span>
									)}
								</div>
								<div className="mt-6 grid gap-y-4 gap-x-8 sm:grid-cols-2">
									{technicalSpecs.map((spec) => (
										<div key={spec.label} className="flex flex-col gap-1">
											<span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
												{spec.label}
											</span>
											<span className="text-sm font-medium text-slate-900">{spec.value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{isLand && landInsights.length > 0 && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<h3 className="text-xl font-semibold text-slate-900">Arazi Bilgileri</h3>
								<div className="mt-6 grid gap-y-4 gap-x-8 sm:grid-cols-2">
									{landInsights.map((item) => (
										<div key={item.label} className="flex flex-col gap-1">
											<span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
												{item.label}
											</span>
											<span className="text-sm font-medium text-slate-900">{item.value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{managementHighlights.length > 0 && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<div className="flex items-center justify-between gap-3">
									<h3 className="text-xl font-semibold text-slate-900">Yönetim & Finans</h3>
									<span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-medium text-emerald-600">
										{formatCurrency(property.price)}
									</span>
								</div>
								<div className="mt-6 grid gap-y-4 gap-x-8 sm:grid-cols-2">
									{managementHighlights.map((item) => (
										<div key={item.label} className="flex flex-col gap-1">
											<span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
												{item.label}
											</span>
											<span className="text-sm font-medium text-slate-900">{item.value}</span>
										</div>
									))}
								</div>

								{managementTags.length > 0 && (
									<div className="mt-6 flex flex-wrap gap-2">
										{managementTags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
						)}

						{property.interiorFeatures && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<h3 className="text-xl font-semibold text-slate-900">İç Mekan Deneyimi</h3>
									<span className="rounded-full bg-slate-900/5 px-4 py-1 text-xs font-medium text-slate-500">
										{property.interiorFeatures.kitchenType} Mutfak
									</span>
								</div>

								{interiorTags.length > 0 ? (
									<div className="mt-6 flex flex-wrap gap-2">
										{interiorTags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600"
											>
												{tag}
											</span>
										))}
									</div>
								) : (
									<p className="mt-6 text-sm text-slate-500">İç mekan özellikleri belirtilmemiş.</p>
								)}
							</div>
						)}

						{property.exteriorFeatures && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<h3 className="text-xl font-semibold text-slate-900">Dış Alanlar</h3>
									{property.exteriorFeatures.facade && (
										<span className="rounded-full bg-slate-900/5 px-4 py-1 text-xs font-medium text-slate-500">
											Cephe: {property.exteriorFeatures.facade}
										</span>
									)}
								</div>
								{exteriorTags.length > 0 ? (
									<div className="mt-6 flex flex-wrap gap-2">
										{exteriorTags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600"
											>
												{tag}
											</span>
										))}
									</div>
								) : (
									<p className="mt-6 text-sm text-slate-500">Dış alan özellikleri belirtilmemiş.</p>
								)}
							</div>
						)}

						{property.buildingFeatures && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<h3 className="text-xl font-semibold text-slate-900">Yaşam Kolaylıkları</h3>
								{buildingTags.length > 0 ? (
									<div className="mt-6 flex flex-wrap gap-2">
										{buildingTags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600"
											>
												{tag}
											</span>
										))}
									</div>
								) : (
									<p className="mt-6 text-sm text-slate-500">Site içi kolaylıklar henüz eklenmedi.</p>
								)}
							</div>
						)}

						{(locationDetails.length > 0 || timeline.length > 0) && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-lg backdrop-blur">
								<div className="grid gap-8 lg:grid-cols-2">
									{locationDetails.length > 0 && (
										<div>
											<h3 className="text-xl font-semibold text-slate-900">Konum</h3>
											<p className="mt-2 text-sm text-slate-500">{locationText}</p>
											<div className="mt-6 space-y-3">
												{locationDetails.map((item) => (
													<div key={item.label} className="flex flex-col">
														<span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
															{item.label}
														</span>
														<span className="text-sm font-medium text-slate-900">{item.value}</span>
													</div>
												))}
											</div>
											{property.location.coordinates && (
												<div className="mt-6 text-xs text-slate-500">
													Koordinatlar: {property.location.coordinates.lat}, {property.location.coordinates.lng}
												</div>
											)}
										</div>
									)}

									{timeline.length > 0 && (
										<div>
											<h3 className="text-xl font-semibold text-slate-900">Zaman Çizelgesi</h3>
											<ul className="mt-6 space-y-4">
												{timeline.map((item) => (
													<li
														key={item.label}
														className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600"
													>
														<span className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
															{item.label}
														</span>
														<span className="mt-1 block text-sm font-medium text-slate-800">{item.value}</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					<div className="space-y-6 lg:sticky lg:top-24">
						{/* PDF ve Print Butonları - Desktop'ta sidebar */}
						<div className="hidden lg:block rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur">
							<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">İşlemler</h3>
							<div className="mt-4 space-y-3">
								<button
									type="button"
									onClick={handleExportPDF}
									className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 shadow-sm hover:shadow active:scale-95"
								>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									PDF İndir
								</button>
								<button
									type="button"
									onClick={handlePrint}
									className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:border-slate-900/30 hover:bg-slate-900/5"
								>
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
									</svg>
									Yazdır
								</button>
								{property.virtualTour && (
									<a
										href={property.virtualTour}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
									>
										Sanal Turu Aç
									</a>
								)}
								<button
									type="button"
									onClick={handleShare}
									className="inline-flex w-full items-center justify-center rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900/30 hover:bg-slate-900/5"
								>
									{shareButtonLabel}
								</button>
								{currentUrl && (
									<div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-2 text-xs text-slate-500">
										<span className="block truncate">{currentUrl}</span>
									</div>
								)}
							</div>
						</div>

						<div className="relative overflow-hidden rounded-[28px] border border-slate-900/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl">
							<div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-emerald-400/20 blur-3xl" />
							<div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
							<div className="relative flex items-center gap-4">
								<div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
									{property.agent.photo ? (
										<img
											src={property.agent.photo}
											alt={property.agent.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<span className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
											{agentInitials}
										</span>
									)}
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Danışmanınız</p>
									<p className="mt-1 text-xl font-semibold text-white">{property.agent.name}</p>
									{property.agent.company && (
										<p className="text-sm text-white/60">{property.agent.company}</p>
									)}
								</div>
							</div>

							<div className="relative mt-8 flex flex-col gap-3">
								<a
									href={`tel:${property.agent.phone}`}
									className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Telefon
								</a>
								<a
									href={`mailto:${property.agent.email}`}
									className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-2 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/10"
								>
									E-posta
								</a>
								{property.agent.isOwner && (
									<span className="mt-2 inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
										Mülk Sahibi
									</span>
								)}
							</div>
						</div>

						<div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur">
							<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">İlan Kontrol Paneli</h3>
							<div className="mt-4 space-y-3 text-sm text-slate-600">
								<div className="flex items-center justify-between">
									<span>Durum</span>
									<span className="font-medium text-slate-900">
										{property.status === "active"
											? "Aktif"
											: property.status === "sold"
											? "Satıldı"
											: property.status === "rented"
											? "Kiralandı"
											: "Pasif"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>İlan Tipi</span>
									<span className="font-medium text-slate-900">{type === "rent" ? "Kiralık" : "Satılık"}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Kategori</span>
									<span className="font-medium text-slate-900">{property.category.main}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Alt Kategori</span>
									<span className="font-medium text-slate-900">{property.category.sub}</span>
								</div>
							</div>
						</div>

						{externalLinks.length > 0 && (
							<div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur">
								<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
									Diğer Platformlar
								</h3>
								<div className="mt-4 space-y-2 text-sm font-medium text-slate-700">
									{externalLinks.map((link) => (
										<a
											key={link.href}
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-2 text-slate-700 transition hover:bg-slate-900/10"
										>
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13.828 10.172a4 4 0 015.657 5.656l-3.182 3.182a4 4 0 11-5.657-5.657l.879-.878"
												/>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7h.01M12 7h.01M8 7h.01M21 7h.01M3 7h.01" />
											</svg>
											{link.label}
										</a>
									))}
								</div>
							</div>
						)}

						<div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-6 shadow-xl backdrop-blur">
							<h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">İlan Kontrol Paneli</h3>
							<div className="mt-4 space-y-3 text-sm text-slate-600">
								<div className="flex items-center justify-between">
									<span>Durum</span>
									<span className="font-medium text-slate-900">
										{property.status === "active"
											? "Aktif"
											: property.status === "sold"
											? "Satıldı"
											: property.status === "rented"
											? "Kiralandı"
											: "Pasif"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>İlan Tipi</span>
									<span className="font-medium text-slate-900">{type === "rent" ? "Kiralık" : "Satılık"}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Kategori</span>
									<span className="font-medium text-slate-900">{property.category.main}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Alt Kategori</span>
									<span className="font-medium text-slate-900">{property.category.sub}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


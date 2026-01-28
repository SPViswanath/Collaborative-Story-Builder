const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = async function generateStoryPDF(story, chapters, res) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true, 
  });

  // Error handling to prevent 500 server crashes
  doc.on('error', (err) => {
    console.error("PDF Generation Error:", err);
    if (!res.headersSent) res.status(500).send("Generation failed");
  });

  /* ---------- HTTP HEADERS ---------- */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${story.title.replace(/\s+/g, '_')}.pdf"`
  );

  doc.pipe(res);

  const COLORS = {
    TITLE: "#0F172A",
    TEXT: "#334155",
    ACCENT: "#059669", 
    MUTED: "#64748B"
  };

  /* ---------- BRANDED LOGO (TOP OF FIRST PAGE ONLY) ---------- */
  const logoPath = path.join(__dirname, "../assests/image.png"); // Using spelling from your screenshot
  
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 30, { width: 140 });
  }

  // A subtle divider line under the logo
  doc
    .strokeColor("#E2E8F0")
    .lineWidth(0.5)
    .moveTo(50, 75)
    .lineTo(545, 75)
    .stroke();

  /* ---------- STORY CONTENT ---------- */
  doc.moveDown(4);

  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor(COLORS.TITLE)
    .text(story.title, { align: "left" });

  doc.moveDown(1);

  if (story.description) {
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(COLORS.TEXT)
      .text(story.description, { align: "justify", lineGap: 4 });
  }

  doc.moveDown(2);

  /* ---------- CHAPTERS ---------- */
  chapters.forEach((chapter, index) => {
    // If we are near the bottom of a page, start the chapter on a fresh page
    if (doc.y > 700) doc.addPage();

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(COLORS.ACCENT)
      .text(`Chapter ${index + 1}: ${chapter.title}`);

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(COLORS.TEXT)
      .text(chapter.content || "", {
        align: "justify",
        lineGap: 5,
        paragraphGap: 10
      });

    doc.moveDown(2);
  });

  /* ---------- FOOTER (PAGE NUMBERS ONLY) ---------- */
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    
    doc
      .fontSize(8)
      .fillColor(COLORS.MUTED)
      .text(
        `Page ${i + 1} of ${range.count} — StoryBuilder`,
        50,
        doc.page.height - 40,
        { align: "center", width: 495 }
      );
  }

  doc.end();
};
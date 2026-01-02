const PDFDocument = require("pdfkit");

const generateStoryPDF = async (story, chapters, res) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4"
  });

  /* -------------------- RESPONSE HEADERS -------------------- */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${story.title}.pdf"`
  );

  doc.pipe(res);

  /* -------------------- COLORS & FONTS -------------------- */
  const TITLE_COLOR = "#1F2937";     // Dark gray
  const TEXT_COLOR = "#374151";      // Medium gray
  const ACCENT_COLOR = "#2563EB";    // Blue

  /* -------------------- STORY TITLE -------------------- */
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor(TITLE_COLOR)
    .text(story.title, {
      align: "center"
    });

  doc.moveDown(0.5);

  // Horizontal line under title
  doc
    .strokeColor(ACCENT_COLOR)
    .lineWidth(2)
    .moveTo(100, doc.y)
    .lineTo(500, doc.y)
    .stroke();

  doc.moveDown(1.5);

  /* -------------------- STORY DESCRIPTION -------------------- */
  if (story.description) {
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor(TEXT_COLOR)
      .text(story.description, {
        align: "justify",
        lineGap: 4
      });

    doc.moveDown(2);
  }

  /* -------------------- CHAPTERS -------------------- */
  chapters.forEach((chapter, index) => {

    // Chapter heading background
    const startY = doc.y;
    doc
      .rect(50, startY - 5, 495, 28)
      .fill("#EFF6FF");

    doc
      .fillColor(ACCENT_COLOR)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        `Chapter ${index + 1}: ${chapter.title}`,
        60,
        startY
      );

    doc.moveDown(1.5);

    // Chapter content
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(TEXT_COLOR)
      .text(chapter.content || " ", {
        align: "justify",
        lineGap: 6
      });

    doc.moveDown(2);
  });

  /* -------------------- FOOTER -------------------- */
  doc
    .fontSize(10)
    .fillColor("#6B7280")
    .text(
      "Generated using Story Builder Platform",
      50,
      doc.page.height - 50,
      { align: "center" }
    );

  doc.end();
};

module.exports = generateStoryPDF;

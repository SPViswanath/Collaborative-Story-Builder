const html_to_pdf = require('html-pdf-node');
const fs = require("fs");
const path = require("path");

module.exports = async function generateStoryPDF(story, chapters, res) {
  try {
    const logoPath = path.join(__dirname, "../assests/image.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const imgData = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${imgData.toString("base64")}`;
    }

    let chaptersHtml = "";
    chapters.forEach((chapter, index) => {
      chaptersHtml += `
        <div class="chapter-page">
          <h2 class="chapter-title">Chapter ${index + 1}: ${chapter.title}</h2>
          <div class="chapter-content">
            ${chapter.content || ""}
          </div>
        </div>
      `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Open+Sans:wght@400;600&display=swap');
          
          body {
            font-family: 'Merriweather', serif;
            color: #1f2937;
            line-height: 1.8;
            margin: 0;
            padding: 0;
          }
          
          .cover-page {
            text-align: center;
            padding-top: 100px;
            page-break-after: always;
          }

          .logo {
            width: 250px;
            margin: 0 auto 40px auto;
          }

          .title {
            font-family: 'Open Sans', sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
          }

          .description {
            font-size: 16px;
            color: #4b5563;
            max-width: 600px;
            margin: 0 auto 30px auto;
            font-style: italic;
          }

          .author {
            font-family: 'Open Sans', sans-serif;
            font-size: 18px;
            color: #6b7280;
          }

          .chapter-page {
            page-break-before: always;
            padding-top: 20px;
          }
          
          .chapter-page:first-of-type {
            page-break-before: auto;
            padding-top: 0;
          }

          .chapter-title {
            font-family: 'Open Sans', sans-serif;
            font-size: 24px;
            color: #059669;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }

          .chapter-content {
            font-size: 14.5px;
            text-align: justify;
          }

          .chapter-content p {
            margin-bottom: 15px;
            margin-top: 0;
          }
          
          .chapter-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 15px 0;
          }
          
          .chapter-content h1, .chapter-content h2, .chapter-content h3 {
            font-family: 'Open Sans', sans-serif;
            color: #111827;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          
          /* TipTap/Quill specific alignments */
          .ql-align-center { text-align: center; }
          .ql-align-right { text-align: right; }
          .ql-align-justify { text-align: justify; }
        </style>
      </head>
      <body>
        <div class="cover-page">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo" />` : ""}
          <div class="title">${story.title}</div>
          ${story.description ? `<div class="description">${story.description}</div>` : ""}
          ${story.author && story.author.name ? `<div class="author">by ${story.author.name}</div>` : ""}
        </div>
        ${chaptersHtml}
      </body>
      </html>
    `;

    const options = { 
      format: 'A4',
      margin: {
        top: '60px',
        right: '50px',
        bottom: '80px',
        left: '50px'
      },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width: 100%; font-size: 10px; text-align: center; color: #9ca3af; padding-top: 5px; border-top: 1px solid #e5e7eb; margin: 0 50px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      printBackground: true
    };

    const file = { content: htmlContent };
    
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${story.title.replace(/\s+/g, '_')}.pdf"`
    );
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("PDF Generation Error (html-pdf-node):", error);
    if (!res.headersSent) res.status(500).send("Generation failed");
  }
};
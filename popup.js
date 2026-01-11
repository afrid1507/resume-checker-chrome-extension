pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

document.getElementById("checkBtn").addEventListener("click", async () => {

  const file = document.getElementById("resumeFile").files[0];
  const jdText = document.getElementById("jdText").value;

  if (!file || !jdText) {
    alert("Please upload resume and paste JD");
    return;
  }

  const resumeText = await extractPDFText(file);
  const match = calculateMatch(resumeText, jdText);

  document.getElementById("output").innerText =
    `Match Percentage: ${match}%`;
});

// ---- PDF TEXT EXTRACTION ----
async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    content.items.forEach(item => {
      text += item.str + " ";
    });
  }
  return text;
}

// ---- MATCH LOGIC ----
function calculateMatch(resume, jd) {
  const resumeWords = resume.toLowerCase().split(/\W+/);
  const jdWords = [...new Set(jd.toLowerCase().split(/\W+/))];

  let matched = 0;

  jdWords.forEach(word => {
    if (resumeWords.includes(word)) matched++;
  });

  return ((matched / jdWords.length) * 100).toFixed(2);
}

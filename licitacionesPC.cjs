
const puppeteer = require('puppeteer');
const fs = require('fs');
const isRender = process.env.RENDER === "true";

const urls = [
  "https://www.panamacompra.gob.pa/Inicio/#/oportunidades-de-negocio/servicios-basados-en-ingenieria-investigacion-y-tecnologia?q=9JSYtO8Zvx2buNWZ0BSeg42sDn2YhdWa0NXZ25WagwSYtOscllmbldmbpBiblBycvRWYzFmYgM3bpNWa2JXZTJiOiUGb0lGdiwSM4ojIvJnY1JFZJJye",
  "https://www.panamacompra.gob.pa/Inicio/#/oportunidades-de-negocio/servicios-de-gestion-profesionales-de-empresa-y-administrativos?q=9JycvZXa0Fmc0NXaulWbkFEI5BSYzVmcw1WRgUGZgMXZsFmbvl2clZ2byBFIs42sDnGdzV2RgUGZgM3bpNWa2JXZTJiOiUGb0lGdiwCM4ojIvJnY1JFZJJye",
  "https://www.panamacompra.gob.pa/Inicio/#/oportunidades-de-negocio/servicios-publicos-y-servicios-relacionados-con-el-sector-publico?q=0nIvNWasJmuDDFIy9GdjV2UgwWZg42bjBycvRWYu9WajFGblJFIz9WajlmdyV2UgkHIz92YpxmY6OMUgM3bpNWa2JXZTJiOiUGb0lGdiwyM4ojIvJnY1JFZJJye",
  "https://www.panamacompra.gob.pa/Inicio/#/oportunidades-de-negocio/telecomunicaciones-y-radiodifusion-de-tecnologia-de-la-informacion?q=Qfi42sDn2Yh1mcvZmbpBSYsBSZkBSYtO8Zvx2buNWZ0BSZkBibzOcazVnZpR2bpRWYyBSegMXZu9WajF2Yp5Wdt92YlxWZUJiOiUGb0lGdiwyM0ojIvJnY1JFZJJye"
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, 
    executablePath: isRender ? '/usr/bin/google-chrome-stable' : undefined,
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox']

  });
  const page = await browser.newPage();
  let allResults = [];

  for (const url of urls) {
    console.log(`Abriendo: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 6000));  // Esperar a que cargue contenido dinámico

    const results = await page.evaluate(() => {
      const rows = document.querySelectorAll("tbody tr");
      return Array.from(rows).map(row => {
        const cells = row.querySelectorAll("td");
        return {
          numero: cells[0]?.innerText.trim(),
          estado: cells[1]?.innerText.trim(),
          descripcion: cells[2]?.innerText.trim(),
          entidad: cells[3]?.innerText.trim(),
        };
      });
    });

    allResults = allResults.concat(results);
  }

  await browser.close();

  fs.writeFileSync("licitaciones.json", JSON.stringify(allResults, null, 2), "utf-8");
  console.log("✅ Datos guardados en licitaciones.json");
})();

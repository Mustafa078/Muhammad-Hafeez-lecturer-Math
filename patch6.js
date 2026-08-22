const fs = require('fs');
let content = fs.readFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', 'utf8');

content = content.replace(
  '<a href="/m-hafeez-cv.pdf" download className="button-primary ml-2 py-3 text-[10px]" data-testid="link-download-cv-nav">',
  '<a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="button-primary ml-2 py-3 text-[10px]" data-testid="link-download-cv-nav">'
);

content = content.replace(
  '<a href="/m-hafeez-cv.pdf" download className="button-primary mt-4 w-fit" data-testid="link-download-cv-mobile">',
  '<a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="button-primary mt-4 w-fit" data-testid="link-download-cv-mobile">'
);

content = content.replace(
  '<a href="/m-hafeez-cv.pdf" download className="mt-9 inline-flex items-center gap-2 border-b border-[#f3e5c2] pb-2 text-sm font-semibold text-[#f3e5c2] transition-colors hover:text-white" data-testid="link-download-cv-contact">',
  '<a href="/m-hafeez-cv.pdf" target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-2 border-b border-[#f3e5c2] pb-2 text-sm font-semibold text-[#f3e5c2] transition-colors hover:text-white" data-testid="link-download-cv-contact">'
);

fs.writeFileSync('artifacts/math-lecturer-portfolio/src/App.tsx', content);

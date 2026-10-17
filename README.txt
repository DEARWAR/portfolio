MANISH DEARWAR PORTFOLIO — HOW TO EDIT
=======================================
1) WhatsApp number / email / LinkedIn:
   Open assets/js/site.js -> edit the CONFIG block at the top (whatsapp: "919876543210").
   The enquiry form, floating WhatsApp button and every "WhatsApp me" button all use this one number.

2) Add project pictures:
   - Copy the image into assets/img/ (jpg/png/webp).
   - In the project's HTML file (project-*.html) find the <section id="gallery"> block, copy one
     <figure class="shot"> ... </figure>, change the file name, title and caption.

3) Add project videos:
   - Put the .mp4 in assets/projects/<project>/videos/ (keep it under ~50 MB, or use YouTube).
   - In the project page, find the "ADD A VIDEO" comment inside <div class="videos"> and use the example
     (self-hosted <video> or YouTube iframe). Delete the "coming soon" card when done.

4) Write the project details:
   Edit the text in each project-*.html (Problem, Solution, Key features, Built / Not built, Tech stack).

5) Publish: upload the whole folder (index.html + project pages + assets) to Netlify / Vercel /
   GitHub Pages / any hosting. Keep the folder structure as it is.

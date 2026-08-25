const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const tailwindConfig = `<script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#1A5336',
              secondary: '#53A548',
              accent: '#F1C40F',
              bglight: '#F4F6F5',
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              heading: ['Montserrat', 'sans-serif'],
            }
          }
        }
      }
    </script>`;

const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(rootDir, file), 'utf8');

    // Inject Tailwind config
    if (content.includes('<script src="https://cdn.tailwindcss.com"></script>') && !content.includes('tailwind.config = {')) {
        content = content.replace('<script src="https://cdn.tailwindcss.com"></script>', tailwindConfig);
    }

    // Replace color classes
    content = content.replace(/bg-pcm-red/g, 'bg-secondary');
    content = content.replace(/text-agro-blue/g, 'text-primary');
    content = content.replace(/border-agro-green/g, 'border-primary');
    content = content.replace(/from-red-500/g, 'from-primary');
    content = content.replace(/via-rose-400/g, 'via-secondary');
    content = content.replace(/to-amber-400/g, 'to-accent');
    
    // Replace hardcoded tailwind colors commonly used in the files
    content = content.replace(/bg-blue-600/g, 'bg-primary');
    content = content.replace(/text-blue-600/g, 'text-primary');
    content = content.replace(/bg-emerald-600/g, 'bg-secondary');
    content = content.replace(/text-emerald-600/g, 'text-secondary');
    content = content.replace(/bg-amber-600/g, 'bg-accent');
    content = content.replace(/text-amber-600/g, 'text-accent');
    content = content.replace(/bg-amber-500/g, 'bg-accent');
    content = content.replace(/text-amber-500/g, 'text-accent');
    content = content.replace(/bg-purple-600/g, 'bg-primary');
    content = content.replace(/text-purple-600/g, 'text-primary');
    
    content = content.replace(/text-blue-400/g, 'text-secondary');
    content = content.replace(/text-emerald-400/g, 'text-accent');
    content = content.replace(/text-red-500/g, 'text-accent');
    
    // Gradients adjustments
    content = content.replace(/from-blue-900/g, 'from-primary');
    content = content.replace(/to-slate-900/g, 'to-primary');
    
    fs.writeFileSync(path.join(rootDir, file), content, 'utf8');
    console.log(`Updated ${file}`);
});

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const file = path.join(rootDir, 'gestion_calidad.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/from-red-900/g, 'from-primary');
content = content.replace(/to-rose-900/g, 'to-secondary');
content = content.replace(/border-red-500/g, 'border-accent');
content = content.replace(/bg-red-500\/20/g, 'bg-accent/20');
content = content.replace(/bg-rose-500\/20/g, 'bg-secondary/20');
content = content.replace(/text-red-200\/80/g, 'text-white/80');
content = content.replace(/text-red-400/g, 'text-accent');
content = content.replace(/text-red-100/g, 'text-white/90');
content = content.replace(/hover:bg-red-50/g, 'hover:bg-secondary/10');
content = content.replace(/hover:text-red-700/g, 'hover:text-primary');
content = content.replace(/text-red-500/g, 'text-secondary');
content = content.replace(/text-red-600/g, 'text-primary');
content = content.replace(/bg-red-50/g, 'bg-secondary/10');
content = content.replace(/bg-red-100/g, 'bg-secondary/20');
content = content.replace(/text-red-700/g, 'text-primary');
content = content.replace(/bg-red-600/g, 'bg-primary');
content = content.replace(/bg-red-700/g, 'bg-primary');

fs.writeFileSync(file, content, 'utf8');
console.log('Updated gestion_calidad.html');

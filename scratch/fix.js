const fs = require('fs');
const glob = require('fs').readdirSync('.');
const files = glob.filter(f => f.endsWith('.html'));

const replacements = {
    'ÅŸ': 'ş',
    'Ä°': 'İ',
    'ÄŸ': 'ğ',
    'Ä±': 'ı',
    'Ã§': 'ç',
    'Ã¶': 'ö',
    'Ã¼': 'ü',
    'Åž': 'Ş',
    'Ã‡': 'Ç',
    'Ã–': 'Ö',
    'Ãœ': 'Ü',
    'Äž': 'Ğ',
    'â€™': "'",
    'â€œ': '"',
    'â€”': '-',
    'â‚º': '₺'
};

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    for (const [bad, good] of Object.entries(replacements)) {
        text = text.split(bad).join(good);
    }
    fs.writeFileSync(file, text, 'utf8');
    console.log('Fixed', file);
});

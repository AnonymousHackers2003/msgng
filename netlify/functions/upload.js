const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Yalnızca POST destekleniyor.'
    };
  }

  const form = new multiparty.Form();

  return new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        return resolve({ statusCode: 500, body: 'Form ayrıştırılamadı.' });
      }

      const file = files.file?.[0];
      if (!file) {
        return resolve({ statusCode: 400, body: 'Dosya bulunamadı.' });
      }

      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const destPath = path.join(uploadsDir, file.originalFilename);

      fs.copyFile(file.path, destPath, (err) => {
        if (err) {
          return resolve({ statusCode: 500, body: 'Dosya kaydedilemedi.' });
        }

        resolve({
          statusCode: 200,
          body: `${file.originalFilename} başarıyla yüklendi.`
        });
      });
    });
  });
};

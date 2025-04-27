const { execFile } = require('child_process');
const path = require('path');

const tokenChecker = (text) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../pythonUtils/tokenCounter.py');
    execFile('python', [scriptPath, text], (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const count = parseInt(stdout.trim(), 10);
        if (isNaN(count)) {
          reject(new Error('토큰 수 계산 실패: 결과가 숫자가 아님'));
        } else {
          resolve(count);
        }
      }
    });
  });
};

exports.tokenChecker = tokenChecker;
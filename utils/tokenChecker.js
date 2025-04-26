const { exec } = require('child_process');
const path = require('path');

function countTokens(text) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../pythonUtils/tokenCounter.py');
      const command = `python3 "${scriptPath}" "${text}"`;
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Python 실행 에러:', error);
          return reject(error);
        }
  
        const result = stdout.trim();
        const tokenCount = parseInt(result, 10);
  
        if (isNaN(tokenCount)) {
          return reject(new Error('토큰 수 계산 실패: 결과가 숫자가 아님'));
        }
  
        resolve(tokenCount);
      });
    });
  }
  

  exports.countTokens = tokenCount;
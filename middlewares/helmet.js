const helmet = require('helmet');

function applyHelmet() {
  return helmet({
    contentSecurityPolicy: false
  });
}

module.exports = applyHelmet;
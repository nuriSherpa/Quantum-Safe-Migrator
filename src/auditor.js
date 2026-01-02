const fs = require('fs');
const path = require('path');

class CryptoAuditor {
  static scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const vulnerabilities = [];
      
      // RSA Detection Patterns
      if (this.detectRSA(content)) {
        vulnerabilities.push({
          type: 'RSA',
          severity: 'HIGH',
          message: 'RSA encryption detected - vulnerable to quantum attacks via Shor\'s algorithm',
          fix: 'Replace with NTRU or Kyber (post-quantum algorithms)',
          line: this.getLineNumber(content, /RSA|rsa|generateKeyPair.*rsa|modulusLength.*(2048|4096)/i)
        });
      }
      
      // ECDSA Detection Patterns
      if (this.detectECDSA(content)) {
        vulnerabilities.push({
          type: 'ECDSA',
          severity: 'HIGH',
          message: 'Elliptic Curve cryptography detected - vulnerable to quantum attacks',
          fix: 'Replace with FALCON or Dilithium (post-quantum algorithms)',
          line: this.getLineNumber(content, /ECDSA|ecdsa|elliptic.*curve|secp256k1|prime256v1/i)
        });
      }
      
      // AES-128 Detection
      if (this.detectAES128(content)) {
        vulnerabilities.push({
          type: 'AES-128',
          severity: 'MEDIUM',
          message: 'AES-128 detected - quantum computers may weaken via Grover\'s algorithm',
          fix: 'Upgrade to AES-256-GCM or use LightSaber',
          line: this.getLineNumber(content, /AES-128|aes-128|createCipheriv.*aes-128/i)
        });
      }
      
      // DSA Detection
      if (this.detectDSA(content)) {
        vulnerabilities.push({
          type: 'DSA',
          severity: 'HIGH',
          message: 'DSA signatures detected - vulnerable to quantum attacks',
          fix: 'Replace with FALCON (post-quantum algorithm)',
          line: this.getLineNumber(content, /DSA|dsa|createSign.*dsa/i)
        });
      }
      
      // Diffie-Hellman Detection
      if (this.detectDiffieHellman(content)) {
        vulnerabilities.push({
          type: 'Diffie-Hellman',
          severity: 'HIGH',
          message: 'Diffie-Hellman key exchange detected - vulnerable to quantum attacks',
          fix: 'Replace with post-quantum key encapsulation (Kyber)',
          line: this.getLineNumber(content, /DiffieHellman|diffie.*hellman|createDiffieHellman/i)
        });
      }
      
      return {
        file: filePath,
        vulnerabilities: vulnerabilities,
        riskScore: this.calculateRiskScore(vulnerabilities)
      };
    } catch (error) {
      return {
        file: filePath,
        error: error.message,
        vulnerabilities: [],
        riskScore: 0
      };
    }
  }
  
  static detectRSA(content) {
    const patterns = [
      /RSA|rsa/i,
      /modulusLength.*(2048|4096)/,
      /crypto\.generateKeyPair.*rsa/i,
      /crypto\.publicEncrypt|crypto\.privateDecrypt/,
      /forge\.rsa|node-rsa|jsrsasign/i,
      /keySize.*1024|2048|4096/
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  static detectECDSA(content) {
    const patterns = [
      /ECDSA|ecdsa/i,
      /elliptic.*curve/i,
      /crypto\.createSign.*sha256|sha384|sha512/,
      /crypto\.createVerify/,
      /secp256k1|secp384r1|prime256v1/,
      /ed25519|ed448/i,
      /curve25519|curve448/i
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  static detectAES128(content) {
    const patterns = [
      /AES-128|aes-128/i,
      /crypto\.createCipheriv.*aes-128/i,
      /aes128/i
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  static detectDSA(content) {
    const patterns = [
      /DSA|dsa/i,
      /createSign.*dsa/i
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  static detectDiffieHellman(content) {
    const patterns = [
      /DiffieHellman|diffie.*hellman/i,
      /createDiffieHellman/i,
      /ECDH|ecdh/i
    ];
    return patterns.some(pattern => pattern.test(content));
  }
  
  static getLineNumber(content, pattern) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        return i + 1;
      }
    }
    return 'N/A';
  }
  
  static calculateRiskScore(vulnerabilities) {
    if (vulnerabilities.length === 0) return 100;
    
    let score = 100;
    vulnerabilities.forEach(vuln => {
      if (vuln.severity === 'HIGH') score -= 30;
      if (vuln.severity === 'MEDIUM') score -= 15;
      if (vuln.severity === 'LOW') score -= 5;
    });
    
    return Math.max(0, Math.min(100, score));
  }
  
  static scanProject(projectPath = '.') {
    const results = {
      scanned: new Date().toISOString(),
      files: [],
      summary: {
        totalFiles: 0,
        vulnerableFiles: 0,
        totalVulnerabilities: 0,
        byType: {}
      },
      riskScore: 100
    };
    
    try {
      const files = this.getAllSourceFiles(projectPath);
      results.summary.totalFiles = files.length;
      
      files.forEach(file => {
        const fileResult = this.scanFile(file);
        results.files.push(fileResult);
        
        if (fileResult.vulnerabilities.length > 0) {
          results.summary.vulnerableFiles++;
          results.summary.totalVulnerabilities += fileResult.vulnerabilities.length;
          
          fileResult.vulnerabilities.forEach(vuln => {
            results.summary.byType[vuln.type] = (results.summary.byType[vuln.type] || 0) + 1;
          });
        }
        
        results.riskScore = Math.min(results.riskScore, fileResult.riskScore);
      });
      
      return results;
    } catch (error) {
      return {
        error: error.message,
        ...results
      };
    }
  }
  
  static getAllSourceFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Skip common directories
        if (!['node_modules', '.git', 'dist', 'build', 'coverage'].includes(file)) {
          this.getAllSourceFiles(fullPath, arrayOfFiles);
        }
      } else {
        // Only scan JavaScript/TypeScript files
        if (file.match(/\.(js|ts|jsx|tsx)$/)) {
          arrayOfFiles.push(fullPath);
        }
      }
    });
    
    return arrayOfFiles;
  }
}

module.exports = { CryptoAuditor };
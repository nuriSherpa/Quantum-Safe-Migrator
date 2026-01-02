# 🛡️ Quantum-Safe Migrator

> **Audit your JavaScript/TypeScript code for quantum-vulnerable cryptography**

[![npm version](https://img.shields.io/npm/v/quantum-safe-migrator)](https://www.npmjs.com/package/quantum-safe-migrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Quantum computers will break RSA, ECDSA, and other current encryption algorithms. This tool helps you identify quantum-vulnerable cryptography in your codebase and plan your migration to quantum-safe alternatives.

## 🚀 Quick Start

```bash
# Install globally
npm install -g quantum-safe-migrator

# Or use without installation
npx quantum-safe-migrator audit

# Scan a specific project
npx quantum-safe-migrator audit ./my-project

# Scan a single file
npx quantum-safe-migrator scan ./src/encryption.js

# Get quantum threat information
npx quantum-safe-migrator info
```

## 📋 Features

- 🔍 **Detect** RSA, ECDSA, DSA, Diffie-Hellman, and AES-128 usage
- 📊 **Risk scoring** (0-100) with color-coded output
- 📁 **Recursive scanning** of JavaScript/TypeScript files
- 📝 **Detailed reports** with line numbers and fixes
- 🔧 **CLI & API** for integration into your workflow
- 🎯 **Check specific algorithms** for quantum safety

## 📖 Usage Examples

### Audit a Project
```bash
# Basic audit (current directory)
quantum-audit audit

# Audit specific directory
quantum-audit audit ./src

# Save report to file
quantum-audit audit --output report.txt

# JSON output for CI/CD
quantum-audit audit --json --output vulnerabilities.json

# Quiet mode (minimal output)
quantum-audit audit --quiet
```

### Scan a Single File
```bash
# Scan with human-readable output
quantum-audit scan ./auth.js

# JSON output
quantum-audit scan ./encryption.js --json
```

### Check Algorithm Safety
```bash
# Check if an algorithm is quantum-safe
quantum-audit check RSA
quantum-audit check AES-256
quantum-audit check SHA-3
```

## 🛠️ API Usage

```javascript
const { QuantumSafeMigrator, CryptoAuditor } = require('quantum-safe-migrator');

// Scan entire project
const results = await QuantumSafeMigrator.auditProject('./my-app');
console.log(`Risk Score: ${results.riskScore}/100`);

// Generate formatted report
const report = QuantumSafeMigrator.generateReport(results);
console.log(report);

// Scan single file
const fileResult = CryptoAuditor.scanFile('./src/encryption.js');
console.log(fileResult.vulnerabilities);
```

## 📊 Sample Output

```
╔══════════════════════════════════════════════════════╗
║      🛡️  QUANTUM-SAFE AUDIT REPORT                  ║
╚══════════════════════════════════════════════════════╝

📊 SUMMARY
────────────────────────────────────────────────────
Scanned: 24 files
Vulnerable files: 3
Total vulnerabilities: 5
Risk Score: 🟡 65/100

📈 VULNERABILITY BREAKDOWN
────────────────────────────────────────────────────
RSA: 2 instances
ECDSA: 2 instances
AES-128: 1 instance

🔍 DETAILED FINDINGS
────────────────────────────────────────────────────

📁 ./src/auth.js:
  1. [RSA] RSA encryption detected - vulnerable to quantum attacks via Shor's algorithm
     Line 42 | Fix: Replace with NTRU or Kyber (post-quantum algorithms)
  2. [ECDSA] Elliptic Curve cryptography detected - vulnerable to quantum attacks
     Line 87 | Fix: Replace with FALCON or Dilithium (post-quantum algorithms)

💡 RECOMMENDATIONS
────────────────────────────────────────────────────
⚠️  Medium risk detected. Plan migration within 6-12 months.

1. Replace RSA with NTRU/Kyber
2. Replace ECDSA with FALCON/Dilithium
3. Upgrade AES-128 to AES-256-GCM
4. Implement hybrid approach for transition
5. Stay updated with NIST PQC standards
```

## 🔬 What It Detects

| Algorithm | Quantum Threat | Recommended Replacement |
|-----------|---------------|-------------------------|
| RSA (2048/4096) | 🚨 HIGH - Broken by Shor's algorithm | NTRU, Kyber |
| ECDSA | 🚨 HIGH - Broken by Shor's algorithm | FALCON, Dilithium |
| DSA | 🚨 HIGH - Broken by Shor's algorithm | FALCON |
| Diffie-Hellman | 🚨 HIGH - Broken by Shor's algorithm | Kyber |
| AES-128 | ⚠️ MEDIUM - Weakened by Grover's algorithm | AES-256-GCM |
| AES-256 | ✅ SAFE - 128-bit quantum security | (Keep) |
| SHA-256 | ✅ SAFE - 128-bit quantum security | (Keep) |

## 📁 Project Structure

```
quantum-safe-migrator/
├── src/
│   ├── index.js          # Main module exports
│   └── auditor.js        # Cryptography detection logic
├── bin/
│   └── cli.js           # Command-line interface
├── package.json         # NPM configuration
├── README.md           # This documentation
└── LICENSE             # MIT License
```

## 🚨 The Quantum Threat Timeline

- **2024-2026**: First quantum computers capable of breaking RSA-2048
- **2026-2030**: Widespread emergence of practical quantum attacks
- **2030+**: Current public-key cryptography becomes obsolete
- **Today**: "Harvest Now, Decrypt Later" attacks are happening

## 🔗 Resources

- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [Open Quantum Safe Library](https://openquantumsafe.org)
- [Cloudflare's Post-Quantum Crypto](https://blog.cloudflare.com/post-quantum-crypto/)
- [Google's Quantum Threat FAQ](https://safety.google/security/security-advancements/#quantum)

## 📄 License

MIT © Tendinuri Sherpa(https://github.com/nuriSherpa)

## ⭐ Support

Found this useful? Give it a star on GitHub!

---

**Made with ❤️ to help secure the web against quantum threats**

> "The best time to migrate to post-quantum cryptography was yesterday. The second best time is now."
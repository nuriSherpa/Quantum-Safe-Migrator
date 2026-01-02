#!/usr/bin/env node

const { program } = require('commander');
const { QuantumSafeMigrator, CryptoAuditor } = require('../src/index');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

program
  .name('quantum-audit')
  .description('Audit your JavaScript/TypeScript code for quantum-vulnerable cryptography')
  .version('1.0.0');

program
  .command('audit')
  .description('Audit a project directory for quantum vulnerabilities')
  .argument('[path]', 'Project path to audit', '.')
  .option('-o, --output <file>', 'Save report to file')
  .option('-j, --json', 'Output in JSON format')
  .option('-q, --quiet', 'Minimal output')
  .action(async (projectPath, options) => {
    if (!options.quiet) {
      QuantumSafeMigrator.printWelcome();
    }
    
    try {
      const resolvedPath = path.resolve(projectPath);
      if (!fs.existsSync(resolvedPath)) {
        console.error(chalk.red('❌ Error: Path does not exist'));
        process.exit(1);
      }
      
      if (!options.quiet) {
        console.log(chalk.blue('🔍 Scanning for quantum vulnerabilities...'));
        console.log(chalk.gray(`Path: ${resolvedPath}\n`));
      }
      
      const results = await QuantumSafeMigrator.auditProject(resolvedPath);
      
      if (options.json) {
        const jsonOutput = QuantumSafeMigrator.generateReport(results, 'json');
        if (options.output) {
          fs.writeFileSync(options.output, jsonOutput);
          console.log(chalk.green(`✅ JSON report saved to ${options.output}`));
        } else {
          console.log(jsonOutput);
        }
      } else {
        const report = QuantumSafeMigrator.generateReport(results);
        console.log(report);
        
        if (options.output) {
          fs.writeFileSync(options.output, report);
          console.log(chalk.green(`\n✅ Report saved to ${options.output}`));
        }
        
        // Exit with error code if high risk
        if (results.riskScore < 60) {
          process.exit(1);
        }
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Audit failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('scan <file>')
  .description('Scan a single file for quantum vulnerabilities')
  .option('-j, --json', 'Output in JSON format')
  .action((filePath, options) => {
    try {
      const result = CryptoAuditor.scanFile(filePath);
      
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.blue.bold(`\n🔍 Scanning: ${filePath}`));
        console.log(chalk.gray('─'.repeat(60)));
        
        if (result.error) {
          console.log(chalk.red(`Error: ${result.error}`));
        } else if (result.vulnerabilities.length === 0) {
          console.log(chalk.green('✅ No quantum vulnerabilities found!'));
        } else {
          console.log(chalk.yellow(`Found ${result.vulnerabilities.length} quantum vulnerabilities:`));
          console.log(`Risk Score: ${result.riskScore}/100\n`);
          
          result.vulnerabilities.forEach((vuln, index) => {
            const severityColor = vuln.severity === 'HIGH' ? chalk.red : chalk.yellow;
            console.log(`${index + 1}. ${severityColor(`[${vuln.type}]`)} ${vuln.message}`);
            console.log(`   Line ${vuln.line} | Fix: ${vuln.fix}\n`);
          });
        }
      }
    } catch (error) {
      console.error(chalk.red('❌ Scan failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display information about quantum threats and migration')
  .action(() => {
    QuantumSafeMigrator.printWelcome();
    
    console.log(chalk.bold('\n📚 QUANTUM COMPUTING THREAT'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`
Quantum computers use quantum bits (qubits) that can solve
certain mathematical problems exponentially faster than
classical computers.

🔬 Shor's Algorithm:
   Can factor large numbers quickly, breaking:
   • RSA (public-key encryption)
   • ECDSA (elliptic curve signatures)
   • Diffie-Hellman (key exchange)

⏰ Timeline Estimates:
   • 2024-2026: First demonstrations of breaking RSA-2048
   • 2026-2030: Practical quantum attacks emerge
   • 2030+: Current public-key crypto becomes obsolete

⚠️  "Harvest Now, Decrypt Later":
   Attackers are collecting encrypted data TODAY to
   decrypt it LATER when quantum computers are available.
    `);
    
    console.log(chalk.bold('\n🛡️  POST-QUANTUM CRYPTOGRAPHY (PQC)'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`
NIST (National Institute of Standards and Technology)
has selected quantum-resistant algorithms:

🔐 Key Encapsulation:
   • CRYSTALS-Kyber: Lattice-based, efficient
   • NTRU: Established, patent-free

✍️ Digital Signatures:
   • CRYSTALS-Dilithium: Primary recommendation
   • FALCON: For smaller signatures
   • SPHINCS+: Conservative hash-based

🔗 Resources:
   • NIST PQC Project: https://csrc.nist.gov/projects/post-quantum-cryptography
   • Open Quantum Safe: https://openquantumsafe.org
   • Migration Guides: https://pqc.org
    `);
    
    console.log(chalk.bold('\n🚀 WHY MIGRATE NOW?'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`
1. Data Lifetime: Encrypted data today can be decrypted tomorrow
2. Migration Time: Large systems take years to migrate
3. Compliance: Regulations will require PQC by 2026-2030
4. Competitive Edge: Early adopters will be more secure
    `);
    
    console.log(chalk.italic('\n🔐 Start your migration journey today with quantum-safe-migrator!'));
  });

program
  .command('check <algorithm>')
  .description('Check if a specific algorithm is quantum-vulnerable')
  .action((algorithm) => {
    const vulnerable = {
      'RSA': { safe: false, replacement: 'NTRU or Kyber' },
      'ECDSA': { safe: false, replacement: 'FALCON or Dilithium' },
      'DSA': { safe: false, replacement: 'FALCON' },
      'Diffie-Hellman': { safe: false, replacement: 'Kyber' },
      'AES-128': { safe: 'partially', replacement: 'AES-256-GCM', note: 'Grover\'s algorithm halves security' },
      'AES-256': { safe: true, note: '128-bit quantum security' },
      'SHA-256': { safe: true, note: '128-bit quantum security' },
      'SHA-3': { safe: true, note: 'Quantum-resistant design' },
      'ChaCha20': { safe: true, note: '256-bit security' }
    };
    
    const algo = algorithm.toUpperCase();
    const info = vulnerable[algo];
    
    if (!info) {
      console.log(chalk.yellow(`ℹ️  No information found for "${algorithm}"`));
      return;
    }
    
    console.log(chalk.bold(`\n🔍 ${algo} Quantum Security Analysis`));
    console.log(chalk.gray('─'.repeat(50)));
    
    if (info.safe === true) {
      console.log(chalk.green(`✅ ${algo} is considered quantum-safe`));
      if (info.note) console.log(`Note: ${info.note}`);
    } else if (info.safe === 'partially') {
      console.log(chalk.yellow(`⚠️  ${algo} has reduced quantum security`));
      console.log(`Replacement: ${info.replacement}`);
      if (info.note) console.log(`Note: ${info.note}`);
    } else {
      console.log(chalk.red(`🚨 ${algo} is vulnerable to quantum attacks!`));
      console.log(`Replacement: ${info.replacement}`);
    }
  });

program.parse();
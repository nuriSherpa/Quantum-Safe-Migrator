const { CryptoAuditor } = require('./auditor');
const chalk = require('chalk');

class QuantumSafeMigrator {
  static async auditProject(projectPath = '.') {
    return CryptoAuditor.scanProject(projectPath);
  }
  
  static generateReport(auditResults, format = 'text') {
    if (format === 'json') {
      return JSON.stringify(auditResults, null, 2);
    }
    
    const report = [];
    
    // Header
    report.push(chalk.bold.blue('╔══════════════════════════════════════════════════════╗'));
    report.push(chalk.bold.blue('║      🛡️  QUANTUM-SAFE AUDIT REPORT                  ║'));
    report.push(chalk.bold.blue('╚══════════════════════════════════════════════════════╝'));
    
    // Summary
    report.push(chalk.bold('\n📊 SUMMARY'));
    report.push(chalk.gray('─'.repeat(50)));
    report.push(`Scanned: ${auditResults.summary.totalFiles} files`);
    report.push(`Vulnerable files: ${auditResults.summary.vulnerableFiles}`);
    report.push(`Total vulnerabilities: ${auditResults.summary.totalVulnerabilities}`);
    report.push(`Risk Score: ${this.getRiskScoreEmoji(auditResults.riskScore)} ${auditResults.riskScore}/100`);
    
    // Vulnerability Breakdown
    if (Object.keys(auditResults.summary.byType).length > 0) {
      report.push(chalk.bold('\n📈 VULNERABILITY BREAKDOWN'));
      report.push(chalk.gray('─'.repeat(50)));
      Object.entries(auditResults.summary.byType).forEach(([type, count]) => {
        const severity = type === 'AES-128' ? 'MEDIUM' : 'HIGH';
        const color = severity === 'HIGH' ? chalk.red : chalk.yellow;
        report.push(color(`${type}: ${count} instance${count > 1 ? 's' : ''}`));
      });
    }
    
    // Detailed Findings
    if (auditResults.summary.vulnerableFiles > 0) {
      report.push(chalk.bold('\n🔍 DETAILED FINDINGS'));
      report.push(chalk.gray('─'.repeat(50)));
      
      auditResults.files.forEach(fileResult => {
        if (fileResult.vulnerabilities.length > 0) {
          report.push(chalk.yellow(`\n📁 ${fileResult.file}:`));
          fileResult.vulnerabilities.forEach((vuln, index) => {
            const severityColor = vuln.severity === 'HIGH' ? chalk.red : chalk.yellow;
            report.push(`  ${index + 1}. ${severityColor(`[${vuln.type}]`)} ${vuln.message}`);
            report.push(`     Line ${vuln.line} | Fix: ${vuln.fix}`);
          });
        }
      });
    }
    
    // Recommendations
    report.push(chalk.bold('\n💡 RECOMMENDATIONS'));
    report.push(chalk.gray('─'.repeat(50)));
    
    if (auditResults.riskScore >= 80) {
      report.push(chalk.green('✅ Your code is relatively quantum-safe. Continue monitoring.'));
    } else if (auditResults.riskScore >= 60) {
      report.push(chalk.yellow('⚠️  Medium risk detected. Plan migration within 6-12 months.'));
      report.push('   Consider implementing hybrid cryptography.');
    } else {
      report.push(chalk.red('🚨 High risk detected! Immediate action required.'));
      report.push('   Prioritize migration of critical systems.');
    }
    
    report.push('\n1. Replace RSA with NTRU/Kyber');
    report.push('2. Replace ECDSA with FALCON/Dilithium');
    report.push('3. Upgrade AES-128 to AES-256-GCM');
    report.push('4. Implement hybrid approach for transition');
    report.push('5. Stay updated with NIST PQC standards');
    
    // Timeline
    report.push(chalk.bold('\n📅 QUANTUM THREAT TIMELINE'));
    report.push(chalk.gray('─'.repeat(50)));
    report.push('2024-2026: Quantum computers capable of breaking RSA-2048');
    report.push('2026-2030: Widespread quantum threat emergence');
    report.push('2030+: Current encryption completely broken');
    report.push(chalk.italic('\n🔐 The best time to migrate was yesterday. The second best is now.'));
    
    return report.join('\n');
  }
  
  static getRiskScoreEmoji(score) {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    if (score >= 40) return '🟠';
    return '🔴';
  }
  
  static printWelcome() {
    console.log(chalk.blue.bold(`
╔══════════════════════════════════════════════════════╗
║      🛡️  QUANTUM-SAFE MIGRATOR v1.0.0               ║
║      Audit your code for quantum vulnerabilities     ║
╚══════════════════════════════════════════════════════╝
    `));
  }
}

module.exports = {
  CryptoAuditor,
  QuantumSafeMigrator,
  
  // Convenience exports
  audit: CryptoAuditor.scanProject,
  scanFile: CryptoAuditor.scanFile,
  generateReport: QuantumSafeMigrator.generateReport
};
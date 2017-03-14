import CfopAnalyzer from './cfop-analyzer';
import RouxAnalyzer from './roux-analyzer';

export default {
  cfop: {
    name: 'CFOP',
    analyzer: new CfopAnalyzer()
  },
  roux: {
    name: 'Roux',
    analyzer: new RouxAnalyzer()
  }
};

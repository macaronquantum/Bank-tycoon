import { describe, it, expect } from 'vitest';
import { timeCompression } from './timeCompression';
describe('timeCompression',()=>{
 it('business standard equals 24h',()=>expect(timeCompression.businessLoanStandardSec).toBe(86400));
 it('mortgage compressed to 60 days',()=>expect(timeCompression.mortgageSec).toBe(5184000));
});

import { assert, property, record, string, anything } from 'fast-check';
import { expect } from 'chai';
import validateLostReports from '../../Pet-Finder/utils/validateLostReports.js';
const { validateLostReport } = validateLostReports;



describe('PBT for validateLostReport()', () => {
  it('should accept valid and invalid inputs correctly', async () => {
    const validInputArb = record({
      pet_id: string({ minLength: 1 }),
      owner_id: string({ minLength: 1 }),
      description: string({ minLength: 1, maxLength: 500 }),
      photo: string({ minLength: 1 }),
      lost_at: string({ minLength: 1 }),
      location: string({ minLength: 1 }),
      status: string({ minLength: 1 }),
    });

    const invalidInputArb = anything();

    await assert(
      property(validInputArb, (input) => {
        const result = validateLostReport(input);
        expect(result.status).to.equal('valid');
      }),
      { numRuns: 50 }
    );

    await assert(
      property(invalidInputArb, (input) => {
        try {
          validateLostReport(input);
        } catch (e) {
          expect(e.message).to.be.a('string');
        }
      }),
      { numRuns: 50 }
    );
  });
});

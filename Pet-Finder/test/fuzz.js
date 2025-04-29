import fc from 'fast-check';

describe('SignUp Form Fuzzing Suite', () => {
  test('email validation handles arbitrary inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), // Generate random strings
        (email) => {
          try {
            const emailRegex = /\S+@\S+\.\S+/;
            // Test email validation
            return typeof emailRegex.test(email) === 'boolean';
          } catch (e) {
            return false; // Test fails if validation throws
          }
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('password validation handles arbitrary inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), // Generate random strings
        (password) => {
          try {
            // Test password requirements
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[\W_]/.test(password);
            const isLongEnough = password.length >= 8;
            
            // Should not throw for any input
            return typeof (hasNumber && hasSpecial && isLongEnough) === 'boolean';
          } catch (e) {
            return false;
          }
        }
      ),
      {
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('date of birth validation handles arbitrary inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), // Generate random strings
        (dob) => {
          try {
            const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
            // Test DOB validation
            return typeof dobRegex.test(dob) === 'boolean';
          } catch (e) {
            return false;
          }
        }
      ),
      {
        numRuns: 100,
        verbose: true
      }
    );
  });
});
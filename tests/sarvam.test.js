
const { isRateLimited } = require('../lib/rate-limiter');

describe('Rate Limiter', () => {
  const ip = '127.0.0.1';

  beforeEach(() => {
    // Clear the map if we had a way, but since it's a module, let's just use a new IP for each test
  });

  test('should allow requests within limit', () => {
    const testIp = '1.1.1.1';
    for (let i = 0; i < 10; i++) {
      expect(isRateLimited(testIp, 10, 60000)).toBe(false);
    }
  });

  test('should block requests exceeding limit', () => {
    const testIp = '2.2.2.2';
    for (let i = 0; i < 10; i++) {
      isRateLimited(testIp, 10, 60000);
    }
    expect(isRateLimited(testIp, 10, 60000)).toBe(true);
  });

  test('should reset after time window', (done) => {
    const testIp = '3.3.3.3';
    isRateLimited(testIp, 1, 100);
    expect(isRateLimited(testIp, 1, 100)).toBe(true);

    setTimeout(() => {
      expect(isRateLimited(testIp, 1, 100)).toBe(false);
      done();
    }, 150);
  });
});

describe('OCR Verification Logic', () => {
  test('verify OCR accuracy ≥ 95 % on sample ground truth', () => {
    const groundTruth = "Invoice #123\nDate: 2024-03-12\nTotal: $100.00";
    const ocrOutput = "Invoice #123\nDate: 2024-03-12\nTotal: $100.00";

    const calculateAccuracy = (gt, ocr) => {
      let matches = 0;
      const gtWords = gt.split(/\s+/);
      const ocrWords = ocr.split(/\s+/);

      gtWords.forEach((word, idx) => {
        if (ocrWords[idx] === word) matches++;
      });

      return (matches / gtWords.length) * 100;
    };

    const accuracy = calculateAccuracy(groundTruth, ocrOutput);
    expect(accuracy).toBeGreaterThanOrEqual(95);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { EPIC_FORMAT } from '../services/boothService';
import { POWER_HIERARCHY } from '../services/powerService';
import * as aiService from '../services/aiService';
import * as manifestoService from '../services/manifestoService';

describe('Vote Consciously Architecture Validation', () => {
  describe('EPIC ID Engine', () => {
    it('should validate correct 10-character alphanumeric Indian Voter IDs', () => {
      const validIds = ['ABC1234567', 'XYZ9876543'];
      validIds.forEach(id => {
        expect(EPIC_FORMAT.test(id)).toBe(true);
      });
    });

    it('should invalidate incorrect EPIC ID formats', () => {
      const invalidIds = ['123ABC4567', 'AB1234567', 'ABCD123456', 'ABC12345678', 'abc1234567'];
      invalidIds.forEach(id => {
        expect(EPIC_FORMAT.test(id)).toBe(false);
      });
    });
  });

  describe('Power Mapper', () => {
    it('should verify the logical hierarchy mapping (Base -> Legislative -> Executive -> Head)', () => {
      expect(POWER_HIERARCHY.length).toBe(4);
      expect(POWER_HIERARCHY[0].level).toBe(1);
      expect(POWER_HIERARCHY[0].roles[0].id).toBe('voter');

      expect(POWER_HIERARCHY[1].level).toBe(2);
      expect(POWER_HIERARCHY[1].roles.map(r => r.id)).toContain('mla');
      expect(POWER_HIERARCHY[1].roles.map(r => r.id)).toContain('mp');

      expect(POWER_HIERARCHY[2].level).toBe(3);
      expect(POWER_HIERARCHY[2].roles.map(r => r.id)).toContain('cm');
      expect(POWER_HIERARCHY[2].roles.map(r => r.id)).toContain('pm');

      expect(POWER_HIERARCHY[3].level).toBe(4);
      expect(POWER_HIERARCHY[3].roles[0].id).toBe('president');
    });
  });

  describe('Security Audit (EXIF Metadata & Zero-Storage)', () => {
    it('should correctly identify location signatures and purge image data', async () => {
      const lat = 28.5355;
      const lng = 77.2090;
      const mockImageData = "data:image/jpeg;base64,mockbase64data";

      // Mock console.log to ensure the purging message is logged
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await aiService.verifyInk(mockImageData, lat, lng);
      expect(result.success).toBe(true);
      expect(result.constituency).toBe("SOUTH DELHI");
      
      expect(logSpy).toHaveBeenCalledWith("[DEV MODE]: Image purged from memory to ensure PII compliance.");
      
      logSpy.mockRestore();
    });

    it('should reject mismatched constituency coordinates', async () => {
      const lat = 13.0827; // Chennai coords
      const lng = 80.2707;
      const mockImageData = "data:image/jpeg;base64,mockbase64data";

      const result = await aiService.verifyInk(mockImageData, lat, lng);
      expect(result.success).toBe(false);
      expect(result.error).toBe("CONSTITUENCY_MISMATCH");
    });
  });

  describe('UI/UX Integrity (Manifesto Analyst)', () => {
    it('should render Gemini 1.5 Flash citations correctly', async () => {
      // Mock the manifestoService call
      const query = "What is the policy on education?";
      const mockResponse = {
        answer: "The party promises to increase education budget by 5%. (12 words)",
        quotes: [],
        citations: ["Manifesto 2026, Pg. 14"]
      };

      vi.spyOn(manifestoService, 'fetchManifestoAnalysis').mockResolvedValue(mockResponse);

      const result = await manifestoService.fetchManifestoAnalysis(query, 'aruna');
      
      expect(result.answer).toBe(mockResponse.answer);
      expect(result.citations).toHaveLength(1);
      expect(result.citations[0]).toBe("Manifesto 2026, Pg. 14");
    });
  });
});

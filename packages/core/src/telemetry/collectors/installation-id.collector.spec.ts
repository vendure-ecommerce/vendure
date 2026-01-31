import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InstallationIdCollector } from './installation-id.collector';

vi.mock('fs');
vi.mock('crypto');

describe('InstallationIdCollector', () => {
    let collector: InstallationIdCollector;
    let mockFs: typeof import('fs');
    let mockCrypto: typeof import('crypto');

    const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
    const NEW_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    beforeEach(async () => {
        vi.resetAllMocks();
        collector = new InstallationIdCollector();
        mockFs = await import('fs');
        mockCrypto = await import('crypto');

        // Default mock for randomUUID
        vi.mocked(mockCrypto.randomUUID).mockReturnValue(NEW_UUID);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('collect()', () => {
        it('reads existing valid UUID from file', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue(VALID_UUID);

            const result = collector.collect();

            expect(result).toBe(VALID_UUID);
            expect(mockFs.writeFileSync).not.toHaveBeenCalled();
        });

        it('generates new UUID when file does not exist', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return false;
                if (pathStr.includes('.vendure')) return true;
                return false;
            });

            const result = collector.collect();

            expect(result).toBe(NEW_UUID);
            expect(mockFs.writeFileSync).toHaveBeenCalledWith(
                expect.stringContaining('.installation-id'),
                NEW_UUID,
                'utf-8',
            );
        });

        it('creates .vendure directory if it does not exist', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return false;
                if (pathStr.includes('.vendure')) return false;
                return false;
            });

            collector.collect();

            expect(mockFs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.vendure'), {
                recursive: true,
            });
        });

        it('regenerates UUID when file contains invalid UUID', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                if (pathStr.includes('.vendure')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue('invalid-uuid-format');

            const result = collector.collect();

            expect(result).toBe(NEW_UUID);
            expect(mockFs.writeFileSync).toHaveBeenCalled();
        });

        it('regenerates UUID when file is empty', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                if (pathStr.includes('.vendure')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue('');

            const result = collector.collect();

            expect(result).toBe(NEW_UUID);
        });

        it('returns cached ID on subsequent calls', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue(VALID_UUID);

            const result1 = collector.collect();
            const result2 = collector.collect();
            const result3 = collector.collect();

            expect(result1).toBe(VALID_UUID);
            expect(result2).toBe(VALID_UUID);
            expect(result3).toBe(VALID_UUID);
            // readFileSync should only be called once due to caching
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);
        });

        it('falls back to ephemeral ID on filesystem read error', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockImplementation(() => {
                throw new Error('Permission denied');
            });

            const result = collector.collect();

            expect(result).toBe(NEW_UUID);
        });

        it('falls back to ephemeral ID on filesystem write error', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return false;
                if (pathStr.includes('.vendure')) return true;
                return false;
            });
            vi.mocked(mockFs.writeFileSync).mockImplementation(() => {
                throw new Error('Permission denied');
            });

            const result = collector.collect();

            // Should still return a UUID even if write fails
            expect(result).toBe(NEW_UUID);
        });

        it('trims whitespace from read UUID', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue(`  ${VALID_UUID}  \n`);

            const result = collector.collect();

            expect(result).toBe(VALID_UUID);
        });
    });

    describe('project root detection', () => {
        it('finds project root via node_modules', () => {
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                if (pathStr.includes('node_modules')) return true;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue(VALID_UUID);

            collector.collect();

            expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining('node_modules'));
        });

        it('falls back to cwd when node_modules not found', () => {
            const cwd = process.cwd();
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                const pathStr = p.toString();
                // node_modules not found anywhere
                if (pathStr.includes('node_modules')) return false;
                if (pathStr.includes('.installation-id')) return true;
                return false;
            });
            vi.mocked(mockFs.readFileSync).mockReturnValue(VALID_UUID);

            collector.collect();

            // Verify the fallback path uses cwd
            expect(mockFs.existsSync).toHaveBeenCalledWith(path.join(cwd, '.vendure', '.installation-id'));
        });

        it('handles traversal from root directory without infinite loop', () => {
            // Simulate starting from root - the loop should terminate
            // when currentDir === path.dirname(currentDir) (i.e., '/' === '/')
            let callCount = 0;
            vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                callCount++;
                // Prevent infinite loop in test - fail after reasonable iterations
                if (callCount > 100) {
                    throw new Error('Infinite loop detected in directory traversal');
                }
                const pathStr = p.toString();
                // node_modules never found
                if (pathStr.includes('node_modules')) return false;
                if (pathStr.includes('.installation-id')) return false;
                if (pathStr.includes('.vendure')) return true;
                return false;
            });

            // Should not throw and should return a UUID
            const result = collector.collect();

            expect(result).toBe(NEW_UUID);
            // Verify we didn't hit the infinite loop guard
            expect(callCount).toBeLessThan(100);
        });
    });

    describe('UUID validation', () => {
        const validUUIDs = [
            '550e8400-e29b-41d4-a716-446655440000',
            'A550E840-E29B-41D4-A716-446655440000', // uppercase is valid per RFC 4122
            '00000000-0000-0000-0000-000000000000',
            'ffffffff-ffff-ffff-ffff-ffffffffffff',
        ];

        const invalidUUIDs = [
            'not-a-uuid',
            '550e8400-e29b-41d4-a716', // too short
            '550e8400-e29b-41d4-a716-4466554400000', // too long
            '550e8400e29b41d4a716446655440000', // no dashes
            '550e8400-e29b-41d4-a716-44665544000g', // invalid character
            '',
            '   ',
        ];

        for (const uuid of validUUIDs) {
            it(`accepts valid UUID: ${uuid}`, () => {
                // Create fresh collector to avoid cache
                const freshCollector = new InstallationIdCollector();
                vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                    const pathStr = p.toString();
                    if (pathStr.includes('node_modules')) return true;
                    if (pathStr.includes('.installation-id')) return true;
                    return false;
                });
                vi.mocked(mockFs.readFileSync).mockReturnValue(uuid);

                const result = freshCollector.collect();

                expect(result).toBe(uuid);
                expect(mockFs.writeFileSync).not.toHaveBeenCalled();
            });
        }

        for (const uuid of invalidUUIDs) {
            it(`rejects invalid UUID: "${uuid}"`, () => {
                // Create fresh collector to avoid cache
                const freshCollector = new InstallationIdCollector();
                vi.mocked(mockFs.existsSync).mockImplementation((p: any) => {
                    const pathStr = p.toString();
                    if (pathStr.includes('node_modules')) return true;
                    if (pathStr.includes('.installation-id')) return true;
                    if (pathStr.includes('.vendure')) return true;
                    return false;
                });
                vi.mocked(mockFs.readFileSync).mockReturnValue(uuid);

                const result = freshCollector.collect();

                expect(result).toBe(NEW_UUID);
            });
        }
    });
});

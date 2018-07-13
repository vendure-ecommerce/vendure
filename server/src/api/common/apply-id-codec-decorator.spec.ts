import { ApplyIdCodec, IdCodecType } from './apply-id-codec-decorator';

describe('@ApplyIdCodec()', () => {
    let mockResolver: any;
    let mockIdCodec: MockIdCodec;
    let argsReceived: any;
    const RETURN_VAL = 'returnVal';
    const ENCODED_VAL = 'encoded';
    const DECODED_VAL = 'decoded';

    class MockIdCodec implements IdCodecType {
        decode = jest.fn().mockReturnValue(DECODED_VAL);
        encode = jest.fn().mockReturnValue(ENCODED_VAL);
    }

    beforeEach(() => {
        mockIdCodec = new MockIdCodec();
        argsReceived = undefined;

        class MockResolver {
            @ApplyIdCodec(undefined, mockIdCodec)
            getItem(_, args) {
                argsReceived = args;
                return RETURN_VAL;
            }

            @ApplyIdCodec(['foo'], mockIdCodec)
            getItemWithKeys(_, args) {
                argsReceived = args;
                return RETURN_VAL;
            }

            @ApplyIdCodec(undefined, mockIdCodec)
            getItemAsync(_, args) {
                argsReceived = args;
                return Promise.resolve(RETURN_VAL);
            }
        }

        mockResolver = new MockResolver();
    });

    it('calls IdCodec.decode with args', () => {
        const args = { foo: 1 };
        mockResolver.getItem({}, args);

        expect(mockIdCodec.decode).toHaveBeenCalledWith(args, undefined);
    });

    it('passes transformed args to resolver method', () => {
        const args = { foo: 1 };
        mockResolver.getItem({}, args);

        expect(argsReceived).toBe(DECODED_VAL);
    });

    it('calls IdCodec.decode with args and transformKeys', () => {
        const args = { foo: 1 };
        mockResolver.getItemWithKeys({}, args);

        expect(mockIdCodec.decode).toHaveBeenCalledWith(args, ['foo']);
    });

    it('calls IdCodec.encode on return value', () => {
        const args = { foo: 1 };
        mockResolver.getItem({}, args);

        expect(mockIdCodec.encode).toHaveBeenCalledWith(RETURN_VAL);
    });

    it('returns the encoded value', () => {
        const args = { foo: 1 };
        const result = mockResolver.getItem({}, args);

        expect(result).toBe(ENCODED_VAL);
    });

    it('calls IdCodec.encode on returned promise value', () => {
        const args = { foo: 1 };
        return mockResolver.getItemAsync({}, args).then(() => {
            expect(mockIdCodec.encode).toHaveBeenCalledWith(RETURN_VAL);
        });
    });

    it('returns a promise with the encoded value', () => {
        const args = { foo: 1 };
        return mockResolver.getItemAsync({}, args).then(result => {
            expect(result).toBe(ENCODED_VAL);
        });
    });
});

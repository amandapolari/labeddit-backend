export class HashManagerMock {
    public hash = async (plaintext: string): Promise<string> => {
        return 'hash-mock';
    };

    public compare = async (
        plaintext: string,
        hash: string
    ): Promise<boolean> => {
        switch (plaintext) {
            case 'Luan@123':
                return hash === 'hash-mock-luan';

            case 'Amanda@123':
                return hash === 'hash-mock-amanda';

            default:
                return false;
        }
    };
}

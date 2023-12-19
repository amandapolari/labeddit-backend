export class HashManagerMock {
    public hash = async (plaintext: string): Promise<string> => {
        return 'hash-mock';
    };

    public compare = async (
        plaintext: string,
        hash: string
    ): Promise<boolean> => {
        // Compara o hash gerado com base na senha original

        // Lógica específica para os usuários do mock
        switch (plaintext) {
            case 'Luan@123':
                return hash === 'hash-mock-luan';

            case 'Amanda@123':
                return hash === 'hash-mock-amanda';

            case 'Carlinhos@123':
                return hash === 'hash-mock-carlinhos';

            case 'Layla@123':
                return hash === 'hash-mock-layla';

            case 'Bia@123':
                return hash === 'hash-mock-bia';

            case 'Jorginho@123':
                return hash === 'hash-mock-jorginho';

            default:
                return false;
        }
    };
}

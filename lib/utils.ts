import { MOCK_PROVIDERS } from '@/lib/mock-data';

export const getProviderById = (id: string) => {
    return MOCK_PROVIDERS.find(p => p.id === id);
};

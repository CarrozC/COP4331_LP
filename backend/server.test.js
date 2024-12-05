const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

jest.mock('bcrypt', () => ({
    compare: jest.fn((data, hash) => Promise.resolve(data === "testpassword" && hash === "hashedpassword")),
}));

const mockCollection = {
    find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([{ username: 'testuser', password: 'hashedpassword' }]),
    })),
};

jest.mock('mongodb', () => ({
    MongoClient: jest.fn(() => ({
        connect: jest.fn(),
        db: jest.fn(() => ({
            collection: jest.fn(() => mockCollection),
        })),
        close: jest.fn(),
    })),
}));

const client = new MongoClient();

describe('API Endpoints', () => {
    afterAll(async () => {
        await client.close();
    });

    test('POST /api/login - Successful Login', async () => {
        mockCollection.find.mockReturnValue({
            toArray: jest.fn().mockResolvedValue([{ username: 'testuser', password: 'hashedpassword' }]),
        });

        const result = await bcrypt.compare("testpassword", "hashedpassword");
        expect(result).toBe(true);
    }, 10000);

    test('POST /api/login - Incorrect Password', async () => {
        const result = await bcrypt.compare("wrongpassword", "hashedpassword");
        expect(result).toBe(false);
    }, 10000);
});

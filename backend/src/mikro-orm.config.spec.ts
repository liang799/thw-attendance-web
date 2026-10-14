jest.mock('dotenv/config', () => ({}));
jest.mock('node:fs', () => ({ readFileSync: jest.fn() }));

describe('database connection configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('DB_')) delete process.env[key];
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('keeps local MySQL connections on port 3306 without SSL by default', async () => {
    const { default: config } = await import('./mikro-orm.config');

    expect(config.port).toBe(3306);
    expect(config.driverOptions.connection.ssl).toBeUndefined();
  });

  it('uses the supplied port and requires TLS in REQUIRED mode', async () => {
    process.env.DB_PORT = '14027';
    process.env.DB_SSL_MODE = 'REQUIRED';

    const { default: config } = await import('./mikro-orm.config');

    expect(config.port).toBe(14027);
    expect(config.driverOptions.connection.ssl).toEqual({
      rejectUnauthorized: false,
      verifyIdentity: false,
      ca: undefined,
    });
  });

  it('verifies both the certificate and hostname with the configured CA', async () => {
    process.env.DB_SSL_MODE = 'VERIFY_IDENTITY';
    process.env.DB_SSL_CA_PATH = './ca.pem';
    const { readFileSync } = await import('node:fs');
    jest.mocked(readFileSync).mockReturnValue('project-ca');

    const { default: config } = await import('./mikro-orm.config');

    expect(readFileSync).toHaveBeenCalledWith('./ca.pem', 'utf8');
    expect(config.driverOptions.connection.ssl).toEqual({
      rejectUnauthorized: true,
      verifyIdentity: true,
      ca: 'project-ca',
    });
  });

  it('rejects unknown SSL modes instead of silently disabling TLS', async () => {
    process.env.DB_SSL_MODE = 'REQUIERD';

    await expect(import('./mikro-orm.config')).rejects.toThrow(
      'DB_SSL_MODE must be DISABLED, REQUIRED, or VERIFY_IDENTITY',
    );
  });
});

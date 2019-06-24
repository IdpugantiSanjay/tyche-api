import fs from 'fs';

var configPath = 'config.json';

var parsed: { connectionString: string, jwtAuthStrategyKey: 'string' } = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

export default parsed;
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true, // Подробный вывод
	preset: 'ts-jest', // Использует ts-jest для работы с TypeScript
	roots: ['<rootDir>/src'], // Ограничивает тесты папкой src
	testMatch: [
		'**/tests/**/*.[jt]s?(x)', // Тестовые файлы в папках tests
		'**/?(*.)+(spec|test).[jt]s?(x)', // Файлы с окончанием .spec или .test
	],
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Расширения для модулей
	transform: {
		'^.+\\.tsx?$': 'ts-jest', // Трансформация TypeScript файлов
	},
};

export default config;

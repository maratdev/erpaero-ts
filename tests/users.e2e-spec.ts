import { App } from '../src/app';
import { boot } from '../src/main';
import { Logger } from 'tslog';
import request from 'supertest';

let application: App;
const log = new Logger({ name: 'app' });

beforeAll(async () => {
	log.settings.minLevel = 0; // 0 = silent, отключает логирование
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ name: 'aa', email: 'a@a.ru', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: '1' });
		expect(res.body.token).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: '12' });
		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.ru', password: '1' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.token}`);
		expect(res.body.email).toBe('a@a.ru');
	});
	it('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
	log.settings.minLevel = 3; // 3 = info, нормальный уровень логирования
});

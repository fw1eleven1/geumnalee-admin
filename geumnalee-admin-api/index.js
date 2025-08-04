import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3002',
		credentials: true, // 쿠키 허용
	})
);
app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = process.env.AUTH_SECRET_KEY;
const CORRECT_PASSWORD = process.env.AUTH_PASSWORD;
const EXPIRATION_TIME = '1h';

// 토큰 인증 미들웨어 (헤더 또는 쿠키에서 토큰 확인)
const authenticateToken = (req, res, next) => {
	// 헤더에서 토큰 확인
	let token = req.headers['authorization'];
	if (token) {
		token = token.split(' ')[1]; // Bearer TOKEN
	}

	// 쿠키에서 토큰 확인 (헤더에 토큰이 없는 경우)
	if (!token) {
		token = req.cookies['auth-token'];
	}

	if (!token) {
		return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });
	}
};

const pool = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: '3456',
		database: 'geumnalee',
	})
	.promise();

// 로그인 엔드포인트
app.post('/api/auth/login', (req, res) => {
	const { password } = req.body;

	if (password === CORRECT_PASSWORD) {
		const token = jwt.sign({ password }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });

		// HTTPOnly 쿠키 설정
		res.cookie('auth-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
			sameSite: 'strict',
			maxAge: 60 * 60 * 1000, // 1시간
		});

		res.json({ success: true });
	} else {
		res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
	}
});

// 로그아웃 엔드포인트
app.post('/api/auth/logout', (req, res) => {
	res.clearCookie('auth-token');
	res.json({ success: true });
});

// 인증 상태 확인 엔드포인트
app.get('/api/auth/status', (req, res) => {
	const token = req.cookies['auth-token'];

	if (!token) {
		return res.json({ success: true, authenticated: false });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		res.json({ success: true, authenticated: true });
	} catch (error) {
		res.clearCookie('auth-token');
		res.json({ success: true, authenticated: false });
	}
});

// 토큰 검증 엔드포인트
app.post('/api/auth/verify', (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(401).json({ success: false, message: '토큰이 없습니다.' });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		res.json({ success: true, valid: true });
	} catch (error) {
		res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
	}
});

// 관리자 기능 (토큰 인증 필요)
// 타파스 메인
app.get('/api/tapas/main', authenticateToken, async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM tapas WHERE type = "main" ORDER BY sort_order ASC');
		res.json({ success: true, data: rows });
	} catch (error) {
		res.status(500).json({ success: false, message: 'TAPAS 메인 데이터 조회 실패' });
	}
});

// 타파스 사이드
app.get('/api/tapas/side', authenticateToken, async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM tapas WHERE type = "side" ORDER BY sort_order ASC');
		res.json({ success: true, data: rows });
	} catch (error) {
		res.status(500).json({ success: false, message: 'TAPAS 사이드 데이터 조회 실패' });
	}
});

app.listen(5002, () => {
	console.log('Server is running on port 5002');
});

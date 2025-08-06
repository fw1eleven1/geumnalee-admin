import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const r2Client = new S3Client({
	region: 'auto',
	endpoint: process.env.R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
});

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3002',
		credentials: true, // 쿠키 허용
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 응답 헤더에 charset 설정
app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	next();
});

const SECRET_KEY = process.env.AUTH_SECRET_KEY;
const CORRECT_PASSWORD = process.env.AUTH_PASSWORD;
const EXPIRATION_TIME = '1h';

// Multer 설정 (메모리에 파일 저장)
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
		}
	},
});

// R2에 파일 업로드 함수
async function uploadToR2(fileBuffer, filename, contentType) {
	const command = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME,
		Key: `tapas/${filename}`,
		Body: fileBuffer,
		ContentType: contentType,
		ACL: 'public-read',
	});

	await r2Client.send(command);
	return `${process.env.R2_PUBLIC_URL}/tapas/${filename}`;
}

// R2에서 파일 삭제 함수
async function deleteFromR2(imageUrl) {
	try {
		const key = imageUrl.split('/tapas/')[1];
		if (key) {
			const command = new DeleteObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: `tapas/${key}`,
			});
			await r2Client.send(command);
		}
	} catch (error) {
		console.error('R2 파일 삭제 오류:', error);
	}
}

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
		charset: 'utf8mb4',
		connectionLimit: 10,
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

app.get('/api/tapas/:id', authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		const [rows] = await pool.query('SELECT * FROM tapas WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ success: false, message: '타파스를 찾을 수 없습니다.' });
		}
		res.json({ success: true, data: rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, message: 'TAPAS 데이터 조회 실패' });
	}
});

// 타파스 수정 API (이미지 업로드 포함)
app.put('/api/tapas/:id', authenticateToken, upload.single('image'), async (req, res) => {
	const { id } = req.params;
	const { data } = req.body;

	try {
		// 기존 타파스 정보 조회
		const [existingRows] = await pool.query('SELECT * FROM tapas WHERE id = ?', [id]);
		if (existingRows.length === 0) {
			return res.status(404).json({ success: false, message: '타파스를 찾을 수 없습니다.' });
		}

		const existingTapas = existingRows[0];
		let imageUrl = existingTapas.img;

		// 새 이미지가 업로드된 경우
		if (req.file) {
			// 기존 이미지 삭제
			await deleteFromR2(existingTapas.img);

			// 새 이미지 업로드
			const filename = `${path.basename(req.file.originalname)}-${Date.now()}${path.extname(req.file.originalname)}`;
			imageUrl = await uploadToR2(req.file.buffer, filename, req.file.mimetype);
		}

		// 이미지 삭제 요청이 있는 경우
		if (req.body.deleteImage === 'true') {
			// 기존 이미지 삭제
			await deleteFromR2(existingTapas.img);
			imageUrl = '';
		}

		// 타파스 데이터 파싱
		const tapasData = JSON.parse(data);

		// 업데이트할 데이터 준비
		const updateData = {
			name: tapasData.name,
			price: tapasData.price,
			type: tapasData.type,
			desc: tapasData.desc,
			img: imageUrl,
		};

		// 데이터베이스 업데이트
		await pool.query('UPDATE tapas SET `name` = ?, `price` = ?, `type` = ?, `desc` = ?, `img` = ? WHERE id = ?', [
			updateData.name,
			updateData.price,
			updateData.type,
			updateData.desc,
			updateData.img,
			id,
		]);

		// 업데이트된 데이터 조회
		const [updatedRows] = await pool.query('SELECT * FROM tapas WHERE id = ?', [id]);

		res.json({
			success: true,
			message: '타파스가 성공적으로 수정되었습니다.',
			data: updatedRows[0],
		});
	} catch (error) {
		console.error('타파스 수정 오류:', error);
		res.status(500).json({ success: false, message: '타파스 수정에 실패했습니다.' });
	}
});

app.listen(5002, () => {
	console.log('Server is running on port 5002');
});

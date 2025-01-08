const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
app.use(bodyParser.json()); // JSON 요청 파싱

const url = 'mongodb+srv://admin:qwer1234@amyabwert.anvfs.mongodb.net/?retryWrites=true&w=majority&appName=amyabwert'

const router = express.Router();

let cachedClient = null;
let cachedDb = null;

const getDbConnection = async () => {
    if (cachedDb) {
        return cachedDb;
    }
    if (!cachedClient) {
        cachedClient = await new MongoClient(url).connect();
        console.log('새로운 MongoDB 연결 생성');
    }
    cachedDb = cachedClient.db('web');
    return cachedDb;
};

router.get('/', (req, res) => {
    return res.json({ message: "hello world" });
});

router.get('/hello', (req, res) => {
    return res.json({ message: "안녕하세요!!" });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 입력 값 검증
    if (!username || !password) {
        return res.status(400).json({ message: "username과 password를 입력해주세요." });
    }

    try {
        // DB 연결
        const database = await getDbConnection();
        const result = await database.collection('users').findOne({ username: username });

        // 사용자 존재 여부 확인
        if (!result) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // 비밀번호 검증 (단순 비교)
        if (result.password !== password) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        // 성공 응답
        return res.status(200).json({
            message: "로그인 성공",
            data: { result: result.username },
        });

    } catch (err) {
        console.error("DB 오류:", err);
        res.status(500).json({ message: "데이터베이스 오류가 발생했습니다." });
    }
});

router.post('/register', async (req, res)=>{
    const { username, email, password } = req.body;

    try {
        // DB 연결
        const database = await getDbConnection();
        const result = await database.collection('users').insertOne({
           username : username,
           password : password,
           email:email
        });
        return res.status(200).json({
            message: "회원가입 성공",
            data: { result }
        });

    } catch (err) {
        console.error("DB 오류:", err);
        res.status(500).json({ message: "데이터베이스 오류가 발생했습니다." });
    }
})

router.post('/post-test', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "username과 password를 입력해주세요." });   }

    return res.status(200).json({
        message: "Post 요청 성공",
        data: { username, password }
    });
});

router.get('/userinfo', async (req, res) => {
    try {
        const database = await getDbConnection();
        const result = await database.collection('users').find().toArray();
        res.send(result[0]?.result || '사용자가 없습니다.');
    } catch (err) {
        console.error(err);
        res.status(500).send('데이터베이스 오류가 발생했습니다.');
    }
});

app.use('/api', router);

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
};
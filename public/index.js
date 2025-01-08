function selectMenu(page) {
    const iframe = document.getElementById('content');
    iframe.src = 'page/' + page; // iFrame의 src 속성을 변경하여 페이지 로드
}
//배포용
const url = 'https://amyabwert1.netlify.app/api'

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMenu = document.getElementById('loginMenu');
    const myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));

    const response = await fetch(url + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token); // JWT 토큰 저장
        loginMenu.innerHTML = `로그아웃`;
        loginMenu.onclick = logout; // 로그아웃 버튼으로 전환
        myModal.hide();
    }
    alert(result.message);


}

function logout() {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    loginMenu.innerHTML = '로그인';
    loginMenu.onclick = null; // 로그인 버튼으로 원상복구
}


async function register() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    // 간단한 검증
    if (!username || !email || !password || password !== confirmPassword) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
    }

    try {
        // POST 요청
        const response = await fetch(url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            alert('회원가입 성공: ' + result.message);

            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';

        } else {
            const error = await response.json();
            alert('회원가입 실패: ' + error.message);
        }
    } catch (err) {
        console.error('오류 발생:', err);
        alert('서버와의 통신 중 문제가 발생했습니다.');
    }




}
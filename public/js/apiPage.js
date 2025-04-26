function sendJson() {
    const input = document.getElementById('jsonInput').value;
    const responseBlock = document.getElementById('jsonResponse');

    try {
        const payload = JSON.parse(input);

        fetch('/api/reading', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                responseBlock.textContent = JSON.stringify(data, null, 2);
            })
            .catch(err => {
                responseBlock.textContent = '요청 실패: ' + err.message;
            });
    } catch (e) {
        responseBlock.textContent = '❗ JSON 형식이 잘못되었습니다.';
    }
}
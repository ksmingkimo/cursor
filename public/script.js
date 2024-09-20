async function askGemini(question) {
    try {
        console.log('发送问题到服务器:', question);
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`请求失败: ${response.status}, ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('收到服务器响应:', data);
        return data.answer;
    } catch (error) {
        console.error('错误:', error);
        throw error;
    }
}
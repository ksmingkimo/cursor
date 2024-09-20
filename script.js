// 简单的照片轮播功能
const carousel = document.querySelector('.carousel');
const images = carousel.querySelectorAll('img');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
let currentIndex = 0;

function showImage(index) {
    images[currentIndex].classList.remove('active');
    currentIndex = (index + images.length) % images.length;
    images[currentIndex].classList.add('active');
}

function showNextImage() {
    showImage(currentIndex + 1);
}

function showPrevImage() {
    showImage(currentIndex - 1);
}

// 每5秒自动切换一次图片
const intervalId = setInterval(showNextImage, 5000);

// 添加按钮事件监听器
prevButton.addEventListener('click', () => {
    clearInterval(intervalId);
    showPrevImage();
});

nextButton.addEventListener('click', () => {
    clearInterval(intervalId);
    showNextImage();
});

// 初始显示第一张图片
showImage(0);

// 简单的问答功能
const questionInput = document.getElementById('question-input');
const askButton = document.getElementById('ask-button');
const answerDisplay = document.getElementById('answer-display');

// 更新问答功能
const API_KEY = 'AIzaSyCv0QbzMhzCg-x7QjGDfOUuhTzE6s2n1DA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function askGemini(question) {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(corsProxy + `${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: question
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('API请求失败');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

askButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (question) {
        answerDisplay.textContent = "正在思考...";
        try {
            const answer = await askGemini(question);
            answerDisplay.textContent = answer;
        } catch (error) {
            console.error('Error:', error);
            answerDisplay.textContent = "抱歉，我现在无法回答这个问题。";
        }
    } else {
        answerDisplay.textContent = "请输入一个问题。";
    }
});
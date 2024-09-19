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

// 更新问答部分
const qa = {
    "你好": "你好！很高兴认识你。",
    "你是谁": "我是三铭2046的个人网站助手。",
    "三铭2046是谁": "三铭2046是一名热爱创新的软件工程师，专注于前端开发和用户体验设计。",
    "三铭2046的技能是什么": "三铭2046擅长HTML5、CSS3、JavaScript、React和UI/UX设计。"
};

askButton.addEventListener('click', () => {
    const question = questionInput.value.trim();
    const answer = qa[question] || "抱歉，我没有这个问题的答案。";
    answerDisplay.textContent = answer;
});
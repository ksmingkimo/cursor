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

// 直接使用API密钥（注意：在实际应用中不要这样做）
const API_KEY = 'AIzaSyCv0QbzMhzCg-x7QjGDfOUuhTzE6s2n1DA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function askGemini(question) {
    try {
        const projectInfo = `
法国玫瑰是一个位于台北市的高端住宅项目。以下是项目的基本资料：
- 地址：松江路77巷2号
- 总户数：134户
- 屋龄：19年
- 总楼高：11楼
- 土地使用分区：住3、商2
- 公设比：36.28%
- 基地面积：231坪
- 构造种类：RC
- 车位类别：坡道平面
- 车位数量：26
- 国小学区：长安国小（双语）
- 国中学区：长安国中（双语）
- 建设公司：成德建设
- 建筑设计：陈克聚
- 营造公司：助群营造
- 租金：21000元/套
- 交通：近捷运站，双捷运

房价信息：
- 一年成交均价：137.95万/坪
- 历史最高价：143.15万/坪
- 平均成交均价：114.83万/坪
- 历史最低价：76.76万/坪

请根据以上信息回答关于法国玫瑰项目的问题。如果问题不相关，请礼貌地将话题引导回法国玫瑰项目。`;

        const contextPrompt = projectInfo + "\n\n问题是：";
        const fullQuestion = contextPrompt + question;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullQuestion
                    }]
                }],
                generationConfig: {
                    temperature: 0.6,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API请求失败: ${response.status}, ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('错误:', error);
        throw error;
    }
}

// 新增：处理提问的函数
async function handleAsk() {
    const question = questionInput.value.trim();
    if (question) {
        answerDisplay.textContent = "正在思考关于法国玫瑰项目的回答...";
        try {
            console.log("发送问题:", question);
            const answer = await askGemini(question);
            console.log("收到回答:", answer);
            answerDisplay.textContent = answer;
        } catch (error) {
            console.error("详细错误信息:", error);
            answerDisplay.textContent = `抱歉，在回答关于法国玫瑰项目的问题时发生了错误: ${error.message}`;
        }
    } else {
        answerDisplay.textContent = "请输入一个关于法国玫瑰项目的问题。";
    }
}

// 修改：点击按钮时调用 handleAsk 函数
askButton.addEventListener('click', handleAsk);

// 新增：监听输入框的 keydown 事件
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // 阻止默认的回车行为（如表单提交）
        handleAsk();
    }
});

// 在文件末尾添加以下代码

// 获取所有示例问题元素
const exampleQuestions = document.querySelectorAll('.example-question');

// 为每个示例问题添加点击事件监听器
exampleQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const questionText = question.textContent;
        questionInput.value = questionText;
        handleAsk();
    });
});
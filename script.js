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

const presetAnswers = {
    "法国玫瑰的地址在哪里？": "法国玫瑰的地址是台北市松江路77巷2号。",
    "这个项目的公设比是多少？": "法国玫瑰项目的公设比是36.28%。",
    "租金是多少？": "法国玫瑰项目的租金是21000元/月。",
    "项目附近的学区情况如何？": "法国玫瑰项目的学区情况是：国小学区为长安国小（双语），国中学区为长安国中（双语）。"
};

async function askGemini(question, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
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
- 构造种类：RC（钢筋混凝土）
- 车位类别：坡道平面
- 车位数量：26
- 充电设备：未知
- 国小学区：长安国小（双语）
- 国中学区：长安国中（双语）
- 建设公司：成德建设
- 建筑设计：陳克聚
- 租金：21000元/月

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
                        temperature: 0.3, // 降低温度以获得更一致的回答
                        topK: 1,
                        topP: 1,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`尝试 ${attempt + 1} 失败:`, errorData);
                throw new Error(`API请求失败: ${response.status}, ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log(`尝试 ${attempt + 1} 成功, API响应数据:`, data);

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                throw new Error('API响应格式不符合预期');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error(`尝试 ${attempt + 1} 错误:`, error);
            if (attempt === retries - 1) {
                throw error; // 如果是最后一次尝试，则抛出错误
            }
            // 否则等待一秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function handleAsk() {
    const question = questionInput.value.trim();
    if (question) {
        answerDisplay.textContent = "正在思考关于法国玫瑰项目的回答...";
        try {
            let answer;
            if (presetAnswers[question]) {
                answer = presetAnswers[question];
            } else {
                answer = await askGemini(question);
            }
            console.log("收到回答:", answer);
            answerDisplay.textContent = answer;
        } catch (error) {
            console.error("详细错误信息:", error);
            answerDisplay.textContent = `抱歉，在回答关于法国玫瑰项目的问题时发生了错误。请稍后再试或联系管理员。错误详情: ${error.message}`;
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
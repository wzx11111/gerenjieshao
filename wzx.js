// 主逻辑文件 - 处理页面导航和基础交互
document.addEventListener('DOMContentLoaded', function() {
  // 导航栏滚动效果
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('backToTop');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.querySelector('.close-menu');
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  });
  
  // 移动端菜单切换
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // 深色模式切换
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // 保存主题设置
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
  
  // 检查用户主题偏好
  if (localStorage.getItem('theme') === 'dark' || 
      (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }
  
  // 回到顶部功能
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        
        // 关闭移动端菜单
        if (mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
  
  // 联系表单提交
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('消息已发送！我会尽快回复你。');
    document.getElementById('contactForm').reset();
  });
});
// 粒子动画背景
document.addEventListener('DOMContentLoaded', function() {
  function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    // 调整canvas尺寸
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子数据
    const particles = [];
    const particleCount = 80;
    
    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(0, 113, 227, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5
      });
    }
    
    // 绘制粒子
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      requestAnimationFrame(draw);
    }
    
    draw();
  }
  
  initParticles();
});
// 阿里云百炼AI聊天机器人
document.addEventListener('DOMContentLoaded', function() {
  function initAIChat() {
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const chatPanel = document.getElementById('chatbotPanel');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // 检查元素是否存在
    if (!toggleBtn || !chatPanel) {
      console.error('聊天机器人元素未找到');
      return;
    }
    
    console.log('聊天机器人初始化成功');
    
    // 阿里云百炼API配置
    const API_KEY = 'sk-86e4675f4fbb4668b87aaeee558d8678';
    const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    
    // 切换聊天面板
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('聊天按钮被点击');
      chatPanel.classList.toggle('hidden');
      if (!chatPanel.classList.contains('hidden')) {
        chatInput.focus();
      }
    });
    
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chatPanel.classList.add('hidden');
    });
    
    // 发送消息
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;
      
      addMessage(message, 'user');
      chatInput.value = '';
      
      // 显示加载状态
      const loadingMsg = addMessage('', 'bot', true);
      
      try {
        const response = await callBailianAPI(message);
        updateMessage(loadingMsg, response);
        
      } catch (error) {
        console.error('阿里云百炼API调用失败:', error);
        updateMessage(loadingMsg, '抱歉，我暂时无法回答这个问题。请稍后再试 😔');
      }
    });
    
    // 调用阿里云百炼API
    async function callBailianAPI(userMessage) {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            { 
              role: 'system', 
              content: '你是一个专业的简历顾问和技术助手，请基于吴泽轩的简历信息回答问题。吴泽轩是一名前端开发工程师，掌握HTML/CSS、JavaScript、React、Vue等技术，在三亚学院学习区块链工程专业。' 
            },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    }
    
    // 添加消息到聊天界面
    function addMessage(content, sender, isLoading = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}-message ${isLoading ? 'loading' : ''}`;
      
      if (sender === 'user') {
        messageDiv.innerHTML = `
          <div class="message-content bg-primary/20 text-lightText rounded-lg p-3 inline-block float-right max-w-[80%]">
            <p>${content}</p>
          </div>
        `;
      } else {
        if (isLoading) {
          messageDiv.innerHTML = `
            <div class="message-content bg-dark rounded-lg p-3 inline-block max-w-[80%]">
              <div class="typing-dots flex space-x-2">
                <div class="dot bg-primary/50"></div>
                <div class="dot bg-primary/50" style="animation-delay: 0.2s"></div>
                <div class="dot bg-primary/50" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          `;
        } else {
          messageDiv.innerHTML = `
            <div class="message-content bg-dark rounded-lg p-3 inline-block max-w-[80%]">
              <p class="text-lightText">${content}</p>
            </div>
          `;
        }
      }
      
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return messageDiv;
    }
    
    // 更新加载中的消息
    function updateMessage(messageElement, content) {
      messageElement.innerHTML = `
        <div class="message-content bg-dark rounded-lg p-3 inline-block max-w-[80%]">
          <p class="text-lightText">${content}</p>
        </div>
      `;
    }
  }
  
  initAIChat();
});

// 技能展示和项目卡片生成
document.addEventListener('DOMContentLoaded', function() {
  // 生成项目卡片
  function generateProjectCards() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = [
      {
        title: "dom-",
        tech: "React, D3.js, Tailwind CSS",
        image: "https://picsum.photos/id/1016/800/500",
        description: "汇聚大二年级学生项目，基于.js开发，实现数据可视化和交互功能。",
        link: "https://github.com/wzx11111/dom-"
      },
      {
        title: "tongyisyxy",
        tech: "Vue 3, Nuxt, Firebase",
        image: "https://picsum.photos/id/1019/800/500",
        description: "ai智能助手，基于.js开发，实现数据可视化和交互功能。",
        link: "https://github.com/wzx11111/tongyisyxy"
      },
      {
        title: "WZX",
        tech: "Node.js, Express, WebGL",
        image: "https://picsum.photos/id/1035/800/500",
        description: "汇聚web开发，实现数据可视化和交互功能。",
        link: "https://github.com/wzx11111/WZX"
      },
      {
        title: "zuoye",
        tech: "React, GraphQL, Apollo",
        image: "https://picsum.photos/id/1071/800/500",
        description: "js作业",
        link: "https://github.com/wzx11111/zuoye"
      }
    ];
    
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card bg-dark border border-primary/20 rounded-xl overflow-hidden card-hover';
      card.innerHTML = `
        <div class="relative overflow-hidden">
          <img src="${project.image}" alt="${project.title}" class="w-full h-60 object-cover transition-transform duration-700 hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-darker to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div class="p-6">
              <span class="text-secondary text-sm">技术栈</span>
              <div class="tech-tags flex flex-wrap gap-2 mt-2">
                ${project.tech.split(', ').map(tech => `
                  <span class="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">${tech}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">${project.title}</h3>
          <p class="text-mediumText mb-4 line-clamp-2">${project.description}</p>
          <a href="${project.link}" class="inline-flex items-center text-primary font-medium hover:underline">
            查看项目 <i class="fas fa-arrow-right ml-2 text-sm transition-transform hover:translate-x-1"></i>
          </a>
        </div>
      `;
      
      projectsGrid.appendChild(card);
      
      // 添加发光动画效果
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `0 0 20px var(--accentGlow), 0 0 30px var(--primary/50)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
      });
    });
  }
  
  // 生成教育时间轴
  function generateEducationTimeline() {
    const timelineContainer = document.getElementById('educationTimeline');
    const education = [
      {
        year: "2023 - 至今",
        school: "三亚大学",
        major: "区块链工程",
        description: "主修java，python，C++，html等语言"
      },
      {
        year: "2020 - 2023",
        school: "乌审旗高级中学",
        major: "理科",
        description: "考上三亚大学"
      }
    ];
    
    education.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const itemEl = document.createElement('div');
      itemEl.className = `timeline-item mb-16 relative ${isEven ? 'pl-20' : 'pr-20'}`;
      
      itemEl.innerHTML = `
        <div class="timeline-dot absolute ${isEven ? 'left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'right-1/2 transform translate-x-1/2 -translate-y-1/2'} w-6 h-6 rounded-full bg-primary border-2 border-darker shadow-lg hover:scale-125 transition-transform">
          <div class="absolute inset-0 bg-accentGlow rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div class="timeline-content ${isEven ? 'border-l-4 border-primary/30 pl-8' : 'border-r-4 border-primary/30 pr-8'} transform transition-transform duration-500 opacity-0">
          <div class="timeline-date text-lg font-medium text-primary mb-2">${item.year}</div>
          <h3 class="timeline-school text-xl font-bold mb-1">${item.school}</h3>
          <div class="timeline-major text-mediumText mb-3">${item.major}</div>
          <div class="timeline-description text-lightText">${item.description}</div>
        </div>
      `;
      
      timelineContainer.appendChild(itemEl);
      
      // 滚动动画
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            itemEl.querySelector('.timeline-content').style.transform = 'translateX(0)';
            itemEl.querySelector('.timeline-content').style.opacity = '1';
            observer.unobserve(itemEl);
          }
        });
      }, { threshold: 0.1 });
      
      // 初始状态
      itemEl.querySelector('.timeline-content').style.transform = isEven ? 'translateX(-20px)' : 'translateX(20px)';
      itemEl.querySelector('.timeline-content').style.opacity = '0';
      itemEl.querySelector('.timeline-content').style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      
      observer.observe(itemEl);
    });
  }
  
  // 初始化技能雷达图
  function initSkillsRadarChart() {
    const ctx = document.getElementById('skillsRadarChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['HTML/CSS', 'JavaScript', 'React', 'Vue', 'Node.js', 'UI/UX设计'],
        datasets: [{
          label: '技能掌握程度',
          data: [90, 85, 75, 70, 65, 60],
          backgroundColor: 'rgba(0, 113, 227, 0.2)',
          borderColor: 'rgba(0, 113, 227, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(0, 113, 227, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              color: 'rgba(248, 250, 252, 0.7)'
            },
            grid: {
              color: 'rgba(248, 250, 252, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(248, 250, 252, 0.7)'
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
  
  // 初始化技能进度条
  function initSkillProgressBars() {
    const skillsContainer = document.getElementById('skillsContainer');
    const skills = [
      { name: 'HTML5 / CSS3', level: 90 },
      { name: 'JavaScript / ES6+', level: 85 },
      { name: 'React / Redux', level: 80 },
      { name: 'Vue.js / Vuex', level: 75 },
      { name: 'Node.js / Express', level: 70 },
      { name: 'TypeScript', level: 70 },
      { name: 'Webpack', level: 60 },
      { name: 'Git', level: 80 }
    ];
    
    skills.forEach(skill => {
      const skillItem = document.createElement('div');
      skillItem.className = 'skill-item';
      skillItem.innerHTML = `
        <div class="flex justify-between mb-2">
          <span class="font-medium">${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" data-level="${skill.level}"></div>
        </div>
      `;
      
      skillsContainer.appendChild(skillItem);
    });
    
    // 技能进度条动画
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    skillProgressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = `${level}%`;
            observer.unobserve(bar.parentElement.parentElement);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(bar.parentElement.parentElement);
    });
  }
  
  // 初始化所有技能相关功能
  generateProjectCards();
  generateEducationTimeline();
  initSkillsRadarChart();
  initSkillProgressBars();
});
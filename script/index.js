        


            // 1-点击按钮弹出模态弹窗——————————————————————————
            const showModalBtn = document.getElementById('showModalBtn');
            const modal = document.getElementById('modal');
            const overlay1 = document.getElementById('overlay1');

            showModalBtn.addEventListener('click', function() {
           //  modal.classList.add('show'); // 添加 .show 类
            modal.style.display = 'block';
            overlay1.style.display = 'block';
            });

            overlay1.addEventListener('click', function() {
           //  modal.classList.remove('show'); // 移除 .show 类
            modal.style.display = 'none';
            overlay1.style.display = 'none';
            });


           //2-监听所有导航链接的点击事件——————————————————————————

              document.querySelectorAll('header .nav .right a[href^="#"]').forEach(anchor => {
               anchor.addEventListener('click', function (e) {
                   e.preventDefault();

                   const targetId = this.getAttribute('href');
                   let navHeight = 72; // 默认导航栏高度

                   if (window.innerWidth < 720) {
                        navHeight = 64; // 小于720px时的导航栏高度
                   }

                   if (window.innerWidth < 640) {
                        navHeight = 48; // 小于640px时的导航栏高度
                   }

                   const targetPosition = document.querySelector(targetId).offsetTop - navHeight;

                   window.scrollTo({
                       top: targetPosition,
                       behavior: 'smooth'
                   });
               });
           });


           //3-移动端下拉菜单的响应式布局及交互——————————————————————————
           const menuToggle = document.querySelector('.menu-toggle');
           const mobileMenu = document.querySelector('.mobile-menu');
           const overlay = document.querySelector('.overlay');
           const mobileMenuList = document.querySelectorAll('.mobile-menu-list li');

           menuToggle.addEventListener('click', function () {
               mobileMenu.classList.toggle('open');
               overlay.style.display = mobileMenu.classList.contains('open') ? 'block' : 'none';
           });

           overlay.addEventListener('click', function () {
               mobileMenu.classList.remove('open');
               overlay.style.display = 'none';
           });

           mobileMenuList.forEach(function (menuItem) {
               menuItem.addEventListener('click', function () {
                   mobileMenu.classList.remove('open');
                   overlay.style.display = 'none';
               });
           });

           // 获取相关元素
           const displays = document.querySelectorAll('.display');
           const moreButtons = document.querySelectorAll('.display button');

           // 定义点击按钮的计数器和剩余section数量
           let clickCounts = [0, 0, 0];
           let remainingSections = [0, 0, 0];

           // 设置页面初始化状态
           function setInitialState() {
             for (let i = 0; i < displays.length; i++) {
               const display = displays[i];
               const sections = display.querySelectorAll('section');
               const moreButton = moreButtons[i];
               remainingSections[i] = sections.length;
           
               if (window.innerWidth > 641) {
                 showAllSections(sections);
                 moreButton.style.display = 'none';
               } else {
                 hideExtraSections(sections);
                 moreButton.style.display = 'block';
               
                 if (remainingSections[i] <= 3) {
                   moreButton.style.display = 'none';
                 }
               }
             }
           }

           // 显示全部section
           function showAllSections(sections) {
             for (let i = 0; i < sections.length; i++) {
               sections[i].style.display = 'block';
             }
           }

           // 隐藏多余的section
           function hideExtraSections(sections) {
             for (let i = 3; i < sections.length; i++) {
               sections[i].style.display = 'none';
             }
           }

           // 处理点击事件
           function handleClick(event) {
             const index = Array.from(moreButtons).indexOf(event.target);
             clickCounts[index]++;
             const display = displays[index];
             const sections = display.querySelectorAll('section');
             const moreButton = moreButtons[index];
             const clickCount = clickCounts[index];
           
             const start = clickCount * 3;
             const end = start + 3;
           
             for (let i = start; i < end; i++) {
               if (sections[i]) {
                 sections[i].style.display = 'block';
                 remainingSections[index]--;
               } else {
                 break;
               }
             }
         
             if (remainingSections[index] <= 3) {
               moreButton.style.display = 'none';
             }
           }

           // 添加点击事件监听器
           moreButtons.forEach(button => {
             button.addEventListener('click', handleClick);
           });

           // 添加窗口大小变化事件监听器
           window.addEventListener('resize', setInitialState);

           // 在页面加载完成后设置初始状态
           window.addEventListener('load', setInitialState);

           const themeToggle = document.getElementById('themeToggle');
           const heroCharacter = document.getElementById('heroCharacter');
           const savedTheme = localStorage.getItem('portfolio-theme');
           let heroAnimation;

           function loadHeroAnimation(isDark) {
             if (!window.lottie || !heroCharacter) return;
             fetch('./uploads/img/aboutme/character-lottie.json')
               .then(response => response.json())
               .then(animationData => {
                 const captionLayer = animationData.layers?.find(layer => layer.nm === "Hi, I'm alex");
                 if (captionLayer?.t?.d?.k) {
                   captionLayer.t.d.k.forEach(frame => {
                     if (frame.s) frame.s.fc = isDark ? [1, 1, 1] : [0, 0, 0];
                   });
                 }
                 if (isDark) {
                   const invertColors = value => {
                     if (!value || typeof value !== 'object') return;
                     Object.keys(value).forEach(key => {
                       const current = value[key];
                       if (key === 'c' && current && current.a === 0 && Array.isArray(current.k) && current.k.length >= 3) {
                         current.k = current.k.map(channel => 1 - channel);
                       } else if (key !== 'fc') {
                         invertColors(current);
                       }
                     });
                   };
                   invertColors(animationData);
                   if (captionLayer?.t?.d?.k) captionLayer.t.d.k.forEach(frame => { if (frame.s) frame.s.fc = [1, 1, 1]; });
                 }
                 if (heroAnimation) heroAnimation.destroy();
                 heroAnimation = window.lottie.loadAnimation({ container: heroCharacter, renderer: 'svg', loop: true, autoplay: true, animationData });
               });
           }

           function applyTheme(theme) {
             const isDark = theme === 'dark';
             document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
             themeToggle.setAttribute('aria-pressed', String(isDark));
             themeToggle.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
             themeToggle.innerHTML = isDark
               ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM11 2h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.22 5.64l1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12Zm12.02 12.02 1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12ZM18.36 4.22l1.42 1.42-2.12 2.12-1.42-1.42 2.12-2.12ZM6.34 16.24l2.12-2.12 1.42 1.42-2.12 2.12-1.42-1.42Z"></path></svg>'
               : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.5 3.05a8.5 8.5 0 1 0 10.45 10.45A8.5 8.5 0 0 1 10.5 3.05Z"></path></svg>';
             loadHeroAnimation(isDark);
           }

           applyTheme(savedTheme || 'light');
           themeToggle.addEventListener('click', function () {
             const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
             localStorage.setItem('portfolio-theme', nextTheme);
             applyTheme(nextTheme);
           });



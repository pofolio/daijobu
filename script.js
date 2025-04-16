// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function () {
    // 모바일 메뉴 토글
    setupMobileMenu();

    // 슬라이더 기능 초기화
    initFoodSlider();

    // 스크롤 애니메이션
    initScrollAnimations();

    // 이미지 레이지 로딩
    initLazyLoading();

    // 접근성 개선
    enhanceAccessibility();

    // 뉴스레터 폼 제출 처리
    setupNewsletterForm();
});

// 모바일 메뉴 설정
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('main-menu');

    if (menuToggle && mainMenu) {
        // 모바일 메뉴 배경 생성
        const menuBackdrop = document.createElement('div');
        menuBackdrop.className = 'menu-backdrop';
        document.body.appendChild(menuBackdrop);

        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
            menuBackdrop.classList.toggle('active');

            // 접근성: aria-expanded 상태 업데이트
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);

            // 메뉴가 열렸을 때 스크롤 방지
            if (mainMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 배경 클릭 시 메뉴 닫기
        menuBackdrop.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            mainMenu.classList.remove('active');
            menuBackdrop.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });

        // 메뉴 항목 클릭 시 모바일 메뉴 닫기
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {  // 모바일 환경일 때만
                    menuToggle.classList.remove('active');
                    mainMenu.classList.remove('active');
                    menuBackdrop.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

// 음식 슬라이더 초기화
function initFoodSlider() {
    const slider = document.querySelector('.food-slider');
    const sliderDots = document.querySelector('.slider-dots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (slider && sliderDots && prevBtn && nextBtn) {
        const slides = slider.querySelectorAll('.food-card');
        let currentSlide = 0;
        let slideCount = slides.length;
        let slidesToShow = getSlidesToShow();

        // 화면 크기 변경 시 보여줄 슬라이드 수 업데이트
        window.addEventListener('resize', function () {
            slidesToShow = getSlidesToShow();
            updateSlider();
        });

        // 현재 화면 크기에 따라 보여줄 슬라이드 수 결정
        function getSlidesToShow() {
            if (window.innerWidth <= 576) return 1;
            if (window.innerWidth <= 992) return 2;
            return 4;
        }

        // 점 인디케이터 생성
        function createDots() {
            sliderDots.innerHTML = '';
            const numDots = Math.ceil(slideCount / slidesToShow);

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentSlide) dot.classList.add('active');

                dot.addEventListener('click', function () {
                    goToSlide(i);
                });

                // 접근성 향상
                dot.setAttribute('role', 'button');
                dot.setAttribute('aria-label', `슬라이드 ${i + 1}로 이동`);
                dot.setAttribute('tabindex', '0');

                // 키보드 접근성
                dot.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToSlide(i);
                    }
                });

                sliderDots.appendChild(dot);
            }
        }

        // 슬라이더 업데이트
        function updateSlider() {
            // 모바일에서는 슬라이드를 수평으로 스크롤하는 형태로 변경
            if (window.innerWidth <= 768) {
                slider.style.display = 'flex';
                slider.style.overflowX = 'auto';
                slider.style.scrollSnapType = 'x mandatory';

                slides.forEach(slide => {
                    slide.style.flex = '0 0 100%';
                    slide.style.scrollSnapAlign = 'start';
                });
            } else {
                slider.style.display = 'grid';
                slider.style.overflowX = 'hidden';

                slides.forEach((slide, index) => {
                    if (index >= currentSlide * slidesToShow && index < (currentSlide * slidesToShow) + slidesToShow) {
                        slide.style.display = 'block';
                    } else {
                        slide.style.display = 'none';
                    }
                });
            }

            // 점 인디케이터 업데이트
            createDots();
        }

        // 특정 슬라이드로 이동
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateSlider();
        }

        // 다음 슬라이드로 이동
        function nextSlide() {
            if (currentSlide < Math.ceil(slideCount / slidesToShow) - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
        }

        // 이전 슬라이드로 이동
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = Math.ceil(slideCount / slidesToShow) - 1;
            }
            updateSlider();
        }

        // 이벤트 리스너 연결
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // 키보드 접근성
        nextBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            }
        });

        prevBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevSlide();
            }
        });

        // 자동 슬라이드 (선택 사항)
        let autoSlideInterval;

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // 사용자 상호작용 시 자동 슬라이드 일시 중지
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // prefers-reduced-motion 미디어 쿼리 확인
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!prefersReducedMotion.matches) {
            startAutoSlide();
        }

        // 초기 슬라이더 설정
        updateSlider();
    }
}

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
    // 애니메이션 적용할 요소들에 클래스 추가
    const animatedElements = [
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.about-content'),
        ...document.querySelectorAll('.food-card'),
        ...document.querySelectorAll('.restaurant-card'),
        ...document.querySelectorAll('.cta-content'),
        ...document.querySelectorAll('.newsletter-content')
    ];

    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });

    // 스크롤 시 요소가 화면에 나타나면 애니메이션 실행
    function checkVisibility() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // 요소가 화면에 보이는지 확인
            if (rect.top <= windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }

    // 스크롤 이벤트 핸들러 최적화 (디바운싱)
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function () {
            checkVisibility();
        });
    });

    // 초기 체크
    checkVisibility();

    // prefers-reduced-motion 미디어 쿼리 확인
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // 모션 축소 선호 시 모든 요소 바로 표시
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
}

// 이미지 레이지 로딩 초기화
function initLazyLoading() {
    // 이미지에 lazy 클래스 추가
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    images.forEach(img => {
        img.classList.add('lazy');

        // data-src 속성이 없으면 src를 data-src로 이동
        if (!img.dataset.src && img.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'; // 투명 placeholder
        }
    });

    // Intersection Observer를 사용한 레이지 로딩
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;

                    // 실제 이미지 로드
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }

                    // 로드 완료 이벤트
                    lazyImage.onload = function () {
                        lazyImage.classList.add('loaded');
                        lazyImage.onload = null;
                    };

                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        images.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // IntersectionObserver가 지원되지 않는 브라우저를 위한 대체
        function lazyLoad() {
            const lazyImages = document.querySelectorAll('img.lazy:not(.loaded)');

            lazyImages.forEach(function (lazyImage) {
                if (isInViewport(lazyImage)) {
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }

                    lazyImage.onload = function () {
                        lazyImage.classList.add('loaded');
                        lazyImage.onload = null;
                    };
                }
            });
        }

        // 요소가 화면에 보이는지 확인
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // 스크롤 이벤트에 lazyLoad 함수 연결
        let lazyLoadThrottleTimeout;
        window.addEventListener('scroll', function () {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }

            lazyLoadThrottleTimeout = setTimeout(function () {
                lazyLoad();
            }, 20);
        });

        // 초기 로딩
        lazyLoad();
    }
}

// 접근성 개선
function enhanceAccessibility() {
    // 스킵 링크 추가
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = '본문으로 바로가기';
    document.body.prepend(skipLink);

    // 메인 컨텐츠에 id 추가
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
        main.setAttribute('role', 'main');
    }

    // 이미지에 alt 속성 확인
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            console.warn('이미지에 alt 속성이 없습니다:', img);
            img.alt = ''; // 장식용 이미지라고 가정
        }
    });

    // 링크와 버튼에 초점 표시기 강화
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.classList.add('focus-visible');
        });

        element.addEventListener('blur', function () {
            this.classList.remove('focus-visible');
        });
    });
}

// 뉴스레터 폼 제출 처리
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';

            if (email) {
                // 이메일 유효성 검사 (간단한 패턴)
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    showFormMessage('유효한 이메일 주소를 입력해주세요.', 'error');
                    return;
                }

                // 서버로 전송하는 대신 성공 메시지 표시 (백엔드 통합 시 코드 추가 필요)
                showFormMessage('뉴스레터 구독이 완료되었습니다!', 'success');
                form.reset();
            } else {
                showFormMessage('이메일 주소를 입력해주세요.', 'error');
            }
        });

        // 폼 메시지 표시 함수
        function showFormMessage(message, type) {
            // 기존 메시지 제거
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // 새 메시지 생성
            const messageElement = document.createElement('div');
            messageElement.className = `form-message ${type}`;
            messageElement.textContent = message;
            messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');

            // 폼 다음에 메시지 삽입
            form.after(messageElement);

            // 일정 시간 후 메시지 삭제
            setTimeout(() => {
                messageElement.classList.add('form-message-hide');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 3000);
        }
    }
}

// 페이지 로드 성능 측정 (개발 모드에서만 사용)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', function () {
        setTimeout(function () {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('페이지 로드 시간:', pageLoadTime + 'ms');
        }, 0);
    });
}
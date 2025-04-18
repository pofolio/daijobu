document.addEventListener('DOMContentLoaded', function() {
    // 메뉴 토글 기능
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('main-menu');
    const menuBackdrop = document.querySelector('.menu-backdrop');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mainMenu.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        
        // 메뉴가 열려있으면 스크롤 방지
        if (mainMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', toggleMenu);

    // 메뉴 링크 클릭시 메뉴 닫기
    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 카드 메뉴 필터링 기능
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.card-menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성화 버튼 상태 업데이트
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
    
            const filterValue = button.getAttribute('data-filter');
    
            menuItems.forEach(item => {
                // 여기가 문제 - 스타일 변경 및 transition 처리 방식 수정
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // setTimeout 제거하고 즉시 적용
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    // 애니메이션을 위한 opacity와 transform 먼저 변경
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    // display none은 transition 완료 후 적용
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 메뉴 카드 키보드 접근성
    menuItems.forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.querySelector('.card-inner').style.transform = 
                    card.querySelector('.card-inner').style.transform === 'rotateY(180deg)' 
                        ? 'rotateY(0deg)' 
                        : 'rotateY(180deg)';
            }
        });
        
        // 포커스 가능하게 설정
        card.setAttribute('tabindex', '0');
    });

    // 푸드 슬라이더 기능
    const foodSlider = document.getElementById('foodSlider');
    const foodCards = foodSlider.querySelectorAll('.food-card');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const sliderDots = document.getElementById('sliderDots');
    
    let currentSlide = 0;
    let isMoving = false;
    
    // 슬라이더 초기화
    function initSlider() {
        // 첫 번째 슬라이드 활성화
        foodCards[currentSlide].classList.add('active');
        
        // 도트 생성
        foodCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                if (isMoving) return;
                goToSlide(index);
            });
            
            sliderDots.appendChild(dot);
        });
        
        // 첫 슬라이드 활성화
        updateSlider();
    }
    
    // 슬라이더 업데이트
    function updateSlider() {
        // 모든 슬라이드 비활성화
        foodCards.forEach((card, index) => {
            card.classList.remove('active');
            card.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
        
        // 현재 슬라이드 활성화
        foodCards[currentSlide].classList.add('active');
        
        // 도트 업데이트
        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // 특정 슬라이드로 이동
    function goToSlide(index) {
        if (index < 0) {
            index = foodCards.length - 1;
        } else if (index >= foodCards.length) {
            index = 0;
        }
        
        currentSlide = index;
        updateSlider();
    }
    
    // 이전 슬라이드로 이동
    function prevSlide() {
        if (isMoving) return;
        isMoving = true;
        
        goToSlide(currentSlide - 1);
        
        setTimeout(() => {
            isMoving = false;
        }, 500);
    }
    
    // 다음 슬라이드로 이동
    function nextSlide() {
        if (isMoving) return;
        isMoving = true;
        
        goToSlide(currentSlide + 1);
        
        setTimeout(() => {
            isMoving = false;
        }, 500);
    }
    
    // 이벤트 리스너 등록
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // 자동 슬라이드
    let slideInterval = setInterval(nextSlide, 5000);
    
    // 사용자 상호작용시 자동 슬라이드 일시정지
    const pauseAutoSlide = () => {
        clearInterval(slideInterval);
        slideInterval = null;
    };
    
    const resumeAutoSlide = () => {
        if (!slideInterval) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    };
    
    // 마우스 이벤트 처리
    foodSlider.addEventListener('mouseenter', pauseAutoSlide);
    foodSlider.addEventListener('mouseleave', resumeAutoSlide);
    prevButton.addEventListener('mouseenter', pauseAutoSlide);
    prevButton.addEventListener('mouseleave', resumeAutoSlide);
    nextButton.addEventListener('mouseenter', pauseAutoSlide);
    nextButton.addEventListener('mouseleave', resumeAutoSlide);
    sliderDots.addEventListener('mouseenter', pauseAutoSlide);
    sliderDots.addEventListener('mouseleave', resumeAutoSlide);
    
    // 키보드 접근성
    foodSlider.setAttribute('tabindex', '0');
    foodSlider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            pauseAutoSlide();
            prevSlide();
            setTimeout(resumeAutoSlide, 3000);
        } else if (e.key === 'ArrowRight') {
            pauseAutoSlide();
            nextSlide();
            setTimeout(resumeAutoSlide, 3000);
        }
    });
    
    // 슬라이더 초기화
    initSlider();
    
    // 스크롤 애니메이션 효과
    const animateElements = document.querySelectorAll('.about-content, .info-card, .cta-content, .newsletter-content');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animateOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        animateOnScroll.observe(el);
    });
    
    document.querySelectorAll('.animate').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // 모바일에서 카드 메뉴 탭/클릭 토글
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        menuItems.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            card.addEventListener('click', function() {
                // 이미 뒤집혀 있는지 확인
                const isFlipped = cardInner.style.transform === 'rotateY(180deg)';
                
                // 모든 카드 초기화
                menuItems.forEach(item => {
                    item.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
                });
                
                // 클릭한 카드만 토글
                if (!isFlipped) {
                    cardInner.style.transform = 'rotateY(180deg)';
                }
            });
        });
    }
    
    // 부드러운 스크롤 효과
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 뉴스레터 폼 제출 처리
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // 실제 구현시 여기에 API 호출 코드 추가
                alert('뉴스레터 구독이 완료되었습니다. 감사합니다!');
                emailInput.value = '';
            }
        });
    }
    
    // 페이지 로드 시 히어로 섹션 애니메이션
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }, 300);
    }
    
    // 스크롤 위치에 따른 헤더 스타일 변경
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop) {
            // 아래로 스크롤
            header.style.transform = 'translateY(-100%)';
        } else {
            // 위로 스크롤
            header.style.transform = 'translateY(0)';
        }
        
        // 스크롤 위치가 거의 맨 위면 항상 보이게
        if (scrollTop < 50) {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 헤더 스타일 관련 CSS 동적 추가
    const style = document.createElement('style');
    style.textContent = `
        header {
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        header.scrolled {
            background-color: rgba(10, 10, 10, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    // 이미지 지연 로딩
    const lazyImages = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        if (img.getAttribute('data-src')) {
            imageObserver.observe(img);
        }
    });
});
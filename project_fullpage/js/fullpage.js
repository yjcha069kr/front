// 휠 이벤트는 한 번에 여러 번 연속 발생
        // isScrolling 플래그로 애니메이션 중에는 추가 휠 입력 무시
        let isScrolling = false;

        const pages = document.querySelectorAll(".page");
        const pager = document.querySelector(".pager");
        // index: 0, 1, 2, 3
        const lastPageIndex = pages.length - 1; // 3

        /*  배열.forEach((요소, 인덱스, [배열]) => {
            // 실행 코드
            });
            */
        // 인디케이터 생성
        pages.forEach((_, index) => {
            const dot = document.createElement("li");
            // 최초에 첫 번째 섹션에 해당하는 인디케이터(li)에 active 클래스 추가
            pager.appendChild(dot);
            if (index === 0) dot.classList.add("active");

            // 인디케이터 클릭 시 페이지 이동
            dot.addEventListener("click", ()=>{
                moveTo(index);
            });

        });

        const pagerDots = document.querySelectorAll(".pager li");

        // 현재 페이지의 인디케이터에 active 클래스 추가
        function setActivePager(index) {
            pagerDots.forEach(dot => dot.classList.remove("active"));
            // ?.은 옵셔널 체이닝 연산자
            // ?.의 앞의 값이 null 또는 undefined일 경우 에러를 발생시키지 않고 종료
            pagerDots[index]?.classList.add("active");
        }

        // 섹션 이동
        function moveTo(pageIndex) {
            window.scrollTo({
                top: pageIndex * window.innerHeight,
                behavior: "smooth"
            });
            // 인디케이션의 active 클래스 대상 변경
            setActivePager(pageIndex);
        }

        // 휠 이벤트 처리
        window.addEventListener("wheel", (e) => {
            // window.scrollY는 현재 문서가 세로 방향으로 얼마나
            // 스크롤되었는지(px 단위)를 나타내는 읽기 전용 속성
            const scrollTop = window.scrollY;
            // window.innerHeight는 브라우저 뷰포트(Viewport)의 실제 높이(px)
            const lastPageTop = lastPageIndex * window.innerHeight;
            console.log('window.scrollY: ' + window.scrollY);
            console.log('window.innerHeight: ' + window.innerHeight);

            /* footer 영역 */
            if (scrollTop > lastPageTop) {
                // e.deltaY는 마우스 휠 또는 터치패드 스크롤 시
                // 세로 방향으로 얼마나 움직였는지를 나타내는 값
                // 양수면 아래로, 음수면 위로
                if (e.deltaY < 0) {
                    // e.preventDefault(): 기본 이벤트(예, wheel) 방지
                    e.preventDefault();
                    moveTo(lastPageIndex);
                }
                return;
            }

            /* 마지막 페이지 */
            if (scrollTop === lastPageTop) {
                if (e.deltaY > 0) return;

                e.preventDefault();
                moveTo(lastPageIndex - 1);
                return;
            }

            /* 일반 풀페이지 */
            e.preventDefault();
            // isScrolling = true이면 wheel 이벤트 함수 종료
            if (isScrolling) return;
            isScrolling = true;

            // 현재 위치 기준으로 페이지 계산
            // Math.round(숫자) - 숫자를 가장 가까운 정수로 반올림
            // Math.round(3.5) -> 4
            // Math.round(3.1) -> 3
            // Math.ceil() - 올림
            // Math.floor() - 버림
            // 주의! Math.round(-1.5) -> -1
            // 주의! Math.round(-1.6) -> -2
            let currentPage = Math.round(scrollTop / window.innerHeight);
            currentPage += e.deltaY > 0 ? 1 : -1;
            // Math.max(숫자1, 숫자2, ...) - 숫자 중 큰값 반환
            // Math.min(숫자1, 숫자2, ...) - 숫자 중 작은값 반환
            currentPage = Math.max(0, Math.min(currentPage, lastPageIndex));

            moveTo(currentPage);

            setTimeout(() => isScrolling = false, 600);
            // 브라우저는 스크롤 관련 이벤트의 성능을 높이기 위해
            // wheel, touchstart, touchmove 이벤트를 기본적으로 passive로 취급한다.
            // passive 이벤트 리스너로 등록된 이벤트에서는
            // event.preventDefault()를 호출할 수 없다.
            // 따라서, passive를 false로 지정하여
            // event.preventDefault()를 사용할 수 있도록 한다.
        }, { passive: false });
const postList = document.getElementById('post-list');
const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination';
paginationContainer.style.textAlign = 'center';
paginationContainer.style.marginTop = '50px';
paginationContainer.style.marginBottom = '50px';
postList.parentNode.appendChild(paginationContainer);

const postsPerPage = 7;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let totalPages = 1;
let currentTag = '모두';

// 1. 데이터 불러오기
fetch('post/1posts.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    // 날짜 최신순 정렬
    allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    initTags();   // 태그 목록 생성
    filterPosts(); // 초기 필터링 및 렌더링
  })
  .catch(err => {
    console.error("로딩 에러:", err);
    postList.innerHTML = `<p>글 목록 로딩 실패: ${err.message}</p>`;
  });

// 2. 태그 사이드바 초기화
function initTags() {
  const sidebar = document.querySelector('.categories ul');
  if (!sidebar) return;

  sidebar.innerHTML = ''; // 중복 생성 방지용 초기화
  
  const tagSet = new Set(["모두"]);
  allPosts.forEach(p => {
    // tags가 배열인지 확인 후 추가
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => tagSet.add(t));
    }
  });

  tagSet.forEach(tag => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    
    btn.textContent = tag;
    btn.className = 'tag-button'; // 스타일 적용을 위한 클래스
    if (tag === currentTag) btn.classList.add('active');

    // 클릭 이벤트
    btn.onclick = (e) => {
      e.preventDefault();
      currentTag = tag;
      currentPage = 1;
      
      // 버튼 활성화 스타일 제어
      document.querySelectorAll('.tag-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      filterPosts();
    };
    
    li.appendChild(btn);
    sidebar.appendChild(li);
  });
}

// 3. 필터링 로직
function filterPosts() {
  // 태그가 '모두'면 전체, 아니면 해당 태그를 포함하는 게시물만 필터링
  filteredPosts = currentTag === '모두' 
    ? allPosts 
    : allPosts.filter(p => Array.isArray(p.


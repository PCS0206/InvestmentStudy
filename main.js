const postList = document.getElementById('post-list');
const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination';
postList.parentNode.appendChild(paginationContainer);

const postsPerPage = 7;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let currentTag = '모두';

// 1. 게시물 로딩
fetch('post/*posts.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    allPosts = data.sort((a,b) => new Date(b.date) - new Date(a.date));
    initTags();
    filterPosts();
  })
  .catch(err => {
    console.error("데이터 로드 실패:", err);
    postList.innerHTML = `<p style="text-align:center;">게시물을 불러올 수 없습니다.</p>`;
  });

// 2. 태그 사이드바 생성
function initTags() {
  const sidebarUl = document.querySelector('.categories ul');
  if (!sidebarUl) return;

  const tagSet = new Set(["모두"]);
  allPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(t => tagSet.add(t));
    }
  });

  sidebarUl.innerHTML = '';
  tagSet.forEach(tag => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = tag;
    if (tag === currentTag) btn.classList.add('active');

    btn.onclick = () => {
      currentTag = tag;
      currentPage = 1;
      
      // 버튼 디자인 활성화 처리
      document.querySelectorAll('.categories ul li button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      filterPosts();
    };
    li.appendChild(btn);
    sidebarUl.appendChild(li);
  });
}

// 3. 필터링 로직
function filterPosts() {
  filteredPosts = currentTag === '모두' 
    ? allPosts 
    : allPosts.filter(p => p.tags && p.tags.includes(currentTag));
  
  renderPage(1);
}

// 4. 페이지 렌더링
function renderPage(page) {
  currentPage = page;
  postList.innerHTML = '';
  
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = filteredPosts.slice(start, end);

  if (pagePosts.length === 0) {
    postList.innerHTML = '<p style="text-align:center; padding: 50px 0;">해당 카테고리에 글이 없습니다.</p>';
    paginationContainer.innerHTML = '';
    return;
  }

  pagePosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <a href="post/post-template.html?file=${post.filename}" class="post-title">${post.title}</a>
      <div class="post-date">${post.date}</div>
    `;
    postList.appendChild(card);
  });

  renderPagination();
}

// 5. 페이지네이션
function renderPagination() {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = '이전';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { window.scrollTo(0,0); renderPage(currentPage - 1); };

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `${currentPage} / ${totalPages}`;

  const next = document.createElement('button');
  next.textContent = '다음';
  next.disabled = currentPage === totalPages;
  next.onclick = () => { window.scrollTo(0,0); renderPage(currentPage + 1); };

  paginationContainer.appendChild(prev);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(next);
}

const postList = document.getElementById('post-list');
const postsPerPage = 7; // 한 페이지당 글 7개
let currentPage = 1;
let totalPages = 1;
let allPosts = [];

// 페이지 버튼 영역
const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination';
paginationContainer.style.textAlign = 'center';
paginationContainer.style.marginTop = '20px';
postList.parentNode.appendChild(paginationContainer);

// 글 로드
fetch('post/1posts.json')
  .then(res => res.json())
  .then(posts => {
    // 최신순 정렬
    allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    totalPages = Math.ceil(allPosts.length / postsPerPage);
    renderPage(currentPage);
  })
  .catch(err => console.error('글 목록 로드 실패:', err));

// 페이지 렌더링 함수
function renderPage(page) {
  postList.innerHTML = '';

  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = allPosts.slice(start, end);

  pagePosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';

    const title = document.createElement('a');
    title.href = `post/${post.filename}`;
    title.className = 'post-title';
    title.textContent = post.title;

    const date = document.createElement('div');
    date.className = 'post-date';
    date.textContent = post.date;

    const summary = document.createElement('p');
    summary.className = 'post-summary';
    summary.textContent = post.summary;

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(summary);

    postList.appendChild(card);
  });

  renderPagination();
}

// 페이지네이션 버튼 생성
function renderPagination() {
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = '이전';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { currentPage--; renderPage(currentPage); };

  const next = document.createElement('button');
  next.textContent = '다음';
  next.disabled = currentPage === totalPages;
  next.onclick = () => { currentPage++; renderPage(currentPage); };

  paginationContainer.appendChild(prev);
  paginationContainer.appendChild(document.createTextNode(`  ${currentPage} / ${totalPages}  `));
  paginationContainer.appendChild(next);
}


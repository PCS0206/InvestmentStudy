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

// 1posts.json에서 글 목록 읽기
fetch('post/1posts.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); //
    return res.json();
  })
  .then(data => {
    allPosts = data.sort((a,b) => new Date(b.date) - new Date(a.date)); //
    initTags(); //
    filterPosts(); //
  })
  .catch(err => {
    console.error("상세 에러:", err); // 콘솔에서 404인지 문법에러인지 확인 가능
    postList.innerHTML = `<p>글 목록 로딩 실패: ${err.message}</p>`; //
  });

// 태그 사이드바 초기화
function initTags() {
  const sidebar = document.querySelector('.categories ul');
  const tagSet = new Set(["모두"]);
  allPosts.forEach(p => p.tags.forEach(t => tagSet.add(t)));

  tagSet.forEach(tag => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.onclick = () => {
      currentTag = tag;
      currentPage = 1;
      filterPosts();
    };
    li.appendChild(btn);
    sidebar.appendChild(li);
  });
}

// 필터링 + 페이지네이션 계산
function filterPosts() {
  filteredPosts = currentTag === '모두' ? allPosts : allPosts.filter(p => p.tags.includes(currentTag));
  totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  renderPage(currentPage);
}

// 현재 페이지 렌더링
function renderPage(page) {
  postList.innerHTML = '';
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = filteredPosts.slice(start, end);

  pagePosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';

    const title = document.createElement('a');
    // GitHub Pages 환경에서도 Markdown 파일 링크 연결
    title.href = `post/post-template.html?file=${post.filename}`;
    title.className = 'post-title';
    title.textContent = post.title;

    const date = document.createElement('div');
    date.className = 'post-date';
    date.textContent = post.date;

    card.appendChild(title);
    card.appendChild(date);
    postList.appendChild(card);
  });

  renderPagination();
}

// 페이지네이션 버튼 렌더링
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
  paginationContainer.appendChild(document.createTextNode(` ${currentPage} / ${totalPages} `));
  paginationContainer.appendChild(next);
}


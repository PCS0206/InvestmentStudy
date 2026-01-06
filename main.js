const postList = document.getElementById('post-list');
const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination';
paginationContainer.style.textAlign='center';
paginationContainer.style.marginTop='50px';
paginationContainer.style.marginBottom='50px';
postList.parentNode.appendChild(paginationContainer);

const postsPerPage = 7;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let totalPages = 1;
let currentTag = '모두';

// JSON 파일 읽기
fetch('post/1posts.json')
  .then(res => res.json())
  .then(data => {
    allPosts = data.sort((a,b)=>new Date(b.date)-new Date(a.date)); // 최신순 정렬
    initTags();
    filterPosts();
  });

// 태그 사이드바
function initTags(){
  const sidebar = document.querySelector('.categories ul');
  const tagSet = new Set(["모두"]);
  allPosts.forEach(p=>p.tags.forEach(t=>tagSet.add(t)));

  tagSet.forEach(tag=>{
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.onclick = ()=>{
      currentTag = tag;
      currentPage = 1;
      filterPosts();
    };
    li.appendChild(btn);
    sidebar.appendChild(li);
  });
}

// 필터링 + 페이지네이션
function filterPosts(){
  filteredPosts = currentTag==='모두' ? allPosts : allPosts.filter(p=>p.tags.includes(currentTag));
  totalPages = Math.ceil(filteredPosts.length/postsPerPage);
  renderPage(currentPage);
}

function renderPage(page){
  postList.innerHTML='';
  const start=(page-1)*postsPerPage;
  const end=start+postsPerPage;
  const pagePosts=filteredPosts.slice(start,end);

  pagePosts.forEach(post=>{
    const card=document.createElement('div');
    card.className='post-card';

    const title=document.createElement('a');
    title.href=`post/post-template.html?file=${post.filename}`;
    title.className='post-title';
    title.textContent=post.title;

    const date=document.createElement('div');
    date.className='post-date';
    date.textContent=post.date;

    card.appendChild(title);
    card.appendChild(date);
    postList.appendChild(card);
  });

  renderPagination();
}

// 페이지네이션 버튼
function renderPagination(){
  paginationContainer.innerHTML='';
  if(totalPages<=1) return;

  const prev = document.createElement('button');
  prev.textContent='이전';
  prev.disabled=currentPage===1;
  prev.onclick=()=>{currentPage--; renderPage(currentPage);};

  const next = document.createElement('button');
  next.textContent='다음';
  next.disabled=currentPage===totalPages;
  next.onclick=()=>{currentPage++; renderPage(currentPage);};

  paginationContainer.appendChild(prev);
  paginationContainer.appendChild(document.createTextNode(` ${currentPage} / ${totalPages} `));
  paginationContainer.appendChild(next);
}



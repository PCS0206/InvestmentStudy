// 글 목록 자동 생성
const postList = document.getElementById('post-list');

// 게시글 파일명 배열 (추후 서버 없이 바로 GitHub Pages에서 사용)
const posts = [
  { filename: "2026-01-07.html", title: "2026-01-07 | 옵션 전략 정리" },
  { filename: "2026-01-06.html", title: "2026-01-06 | 오늘의 투자 공부" }
];

// 글 목록 만들기
posts.forEach(post => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `post/${post.filename}`;
  a.textContent = post.title;
  li.appendChild(a);
  postList.appendChild(li);
});

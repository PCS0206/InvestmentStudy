const postList = document.getElementById('post-list');

// posts.json 불러오기
fetch('post/1posts.json')
  .then(response => response.json())
  .then(posts => {
    // 최신순 정렬
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    posts.forEach(post => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `post/${post.filename}`;
      a.textContent = post.title;
      li.appendChild(a);
      postList.appendChild(li);
    });
  })
  .catch(err => console.error('글 목록 로드 실패:', err));

---
layout: base
title: AWS Projects
category_name: AWS Projects
permalink: /category/aws-projects/
---

<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 18px; margin-bottom: 50px;">
  <div style="font-family: var(--mono); font-size: 13px; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase;">Category</div>
  <div style="font-family: var(--mono); font-weight: 700; font-size: clamp(34px, 6vw, 64px); line-height: 1.05; letter-spacing: -0.02em; color: var(--gold);">
    AWS Projects
  </div>
</div>

<div class="grid cols-2" id="post-grid" style="margin-top: 40px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
  {% for post in site.categories["AWS Projects"] %}
    <a href="{{ post.url | relative_url }}" class="post-list-item cat-card" style="display: none; background: rgba(232, 176, 75, 0.05); border: 1px solid rgba(232, 176, 75, 0.3); padding: 30px; align-items: flex-start; text-align: left; height: 100%;">
      <h2 style="color: var(--gold); font-size: 20px; line-height: 1.4; margin-bottom: 12px;">{{ post.title }}</h2>
      <div class="date" style="margin-bottom: 16px; opacity: 0.8; font-size: 12px;">{{ post.date | date: "%B %-d, %Y" }}</div>
      {% if post.excerpt %}
        <p style="color: var(--text-dim); font-size: 14px; line-height: 1.6;">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
      {% endif %}
    </a>
  {% endfor %}
</div>

<div id="pagination" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 60px; font-family: var(--mono);">
  <button id="prevBtn" onclick="changePage(-1)" style="padding: 10px 20px; background: var(--bg-panel); border: 1px solid var(--border); color: var(--text-primary); border-radius: 8px; cursor: pointer; transition: 0.2s;">&larr; Previous</button>
  <span id="pageInfo" style="padding: 10px 0; color: var(--text-dim); font-size: 14px;"></span>
  <button id="nextBtn" onclick="changePage(1)" style="padding: 10px 20px; background: var(--bg-panel); border: 1px solid var(--border); color: var(--text-primary); border-radius: 8px; cursor: pointer; transition: 0.2s;">Next &rarr;</button>
</div>

<script>
  const postsPerPage = 6;
  let currentPage = 1;
  const posts = document.querySelectorAll('.post-list-item');
  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;

  function renderPage() {
    if (posts.length === 0) {
      document.getElementById('pagination').style.display = 'none';
      return;
    }
    
    posts.forEach((post, index) => {
      post.style.display = 'none';
      if (index >= (currentPage - 1) * postsPerPage && index < currentPage * postsPerPage) {
        post.style.display = 'flex'; 
      }
    });
    
    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('prevBtn').style.opacity = currentPage === 1 ? '0.3' : '1';
    document.getElementById('prevBtn').style.cursor = currentPage === 1 ? 'default' : 'pointer';
    
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    document.getElementById('nextBtn').style.opacity = currentPage === totalPages ? '0.3' : '1';
    document.getElementById('nextBtn').style.cursor = currentPage === totalPages ? 'default' : 'pointer';
    
    if (totalPages <= 1) {
      document.getElementById('pagination').style.display = 'none';
    }
  }

  function changePage(direction) {
    currentPage += direction;
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderPage();
</script>

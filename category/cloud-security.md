---
layout: base
title: Cloud Security
category_name: Cloud Security
permalink: /category/cloud-security/
---

<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 18px; margin-bottom: 50px;">
  <div style="font-family: var(--mono); font-size: 13px; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase;">Category</div>
  <div style="font-family: var(--mono); font-weight: 700; font-size: clamp(34px, 6vw, 64px); line-height: 1.05; letter-spacing: -0.02em;">
    Cloud Security
  </div>
</div>

<div class="grid cols-2" id="post-grid" style="margin-top: 40px;">
  {% for post in site.categories["Cloud Security"] %}
    <a href="{{ post.url | relative_url }}" class="post-list-item" style="display: none;">
      <h2>{{ post.title }}</h2>
      <div class="date">{{ post.date | date: "%B %-d, %Y" }}</div>
      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
      {% endif %}
    </a>
  {% endfor %}
</div>

<div id="pagination" style="display: flex; justify-content: center; gap: 20px; margin-top: 60px; font-family: var(--mono);">
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

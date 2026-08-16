---
layout: base
title: Projects
category_name: Projects
permalink: /category/projects/
---

<div class="grid cols-2" style="margin-top: 40px;">
  {% for post in site.categories["Projects"] %}
    <a href="{{ post.url | relative_url }}" class="post-list-item">
      <h2>{{ post.title }}</h2>
      <div class="date">{{ post.date | date: "%B %-d, %Y" }}</div>
      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
      {% endif %}
    </a>
  {% endfor %}
</div>

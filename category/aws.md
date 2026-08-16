---
layout: home
title: AWS
category_name: AWS
permalink: /category/aws/
---

<div class="grid cols-2" style="margin-top: 40px;">
  {% for post in site.categories["AWS"] %}
    <a href="{{ post.url | relative_url }}" class="post-list-item">
      <h2>{{ post.title }}</h2>
      <div class="date">{{ post.date | date: "%B %-d, %Y" }}</div>
      {% if post.excerpt %}
        <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
      {% endif %}
    </a>
  {% endfor %}
</div>

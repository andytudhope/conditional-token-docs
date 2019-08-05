/* global hexo */

'use strict';

var pathFn = require('path');
var _ = require('lodash');
var cheerio = require('cheerio');
var lunr = require('lunr');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var localizedPath = ['docs', 'api'];

function startsWith(str, start) {
  return str.substring(0, start.length) === start;
}

hexo.extend.helper.register('sidebar', function(type) {
    
  var self = this,
      path = this.page.path,
      sidebar = this.site.data.sidebar[type],
      result = '<ul class="sidebar-menu">',
      show_lang = '';

  if(this.page.lang != 'en'){
    show_lang = this.page.lang + '/';
  }

  _.each(sidebar, function(menu, category) {
      var title = generateSidebarTitle(category);
      if(typeof menu[category] === 'undefined'){
        title = self.__(title);
      }else{
        title = generateSidebarTitle(menu[category]);
      }
      if(category == 'docs'){
        if(path == 'docs/index.html'){
          result += '<li><a href="/conditional-token-docs/' + show_lang+ 'docs/technical_documentation.html">' + title + '</a>';
        }else{
          result += '<li class="'+ checkIfActive(path, show_lang + category) +'"><a href="/conditional-token-docs/' + show_lang+ 'docs/technical_documentation.html">' + title + '</a>';
        }
      }else{
        result += '<li class="'+ checkIfActive(path, show_lang + category) +'"><a href="/conditional-token-docs/' + show_lang + category + '/">' + title + '</a>';
      }
      if(typeof menu == 'object'){
          result += '<ul class="sidebar-submenu">';
          _.each(menu, function(title, link) {
              if(menu[category] != title){
                var href = '';
                href = category +'/'+ link +'.html';
                href = '/' + show_lang + href;
                if(title.startsWith("..")){
                  href = title.replace("../","");
                  href = href.substring(0, href.indexOf(' '));
                  href = '/' + show_lang + href;
                }else if(title.startsWith("http")){
                  href = title;
                  href = href.substring(0, href.indexOf(' '));
                }
                title = generateSidebarTitle(title);
                result += '<li class="'+ checkIfActive(path, show_lang + category +'/'+ link+'.html') +'"><a href="'+ href +'">' + title + '</a></li>';
              }
          });
          result += '</ul>';
      }
  });

  result += '</ul>';
  return result;
});

function generateSidebarTitle(string){
  var s = string.substring(
      string.lastIndexOf("(") + 1, 
      string.lastIndexOf(")")
  );
  if(s == ''){
    s = string.replace(/_/g, " ");
    s = s.replace(/.html/g, "");
    s = toTitleCase(s);
  }
  return s;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function checkIfActive(path, link){
  if(path.indexOf(link)){
    return '';
  }else{
    return 'active';
  }
}

hexo.extend.helper.register('header_menu', function(className) {
  var menu = this.site.data.menu;
  var result = '';
  var self = this;
  var lang = this.page.lang;
  var isEnglish = lang === 'en';

  _.each(menu, function(path, title) {
    if (!isEnglish && ~localizedPath.indexOf(title)) path = lang + path;

    result += '<a href="' + self.url_for(path) + '" class="' + className + '-link">' + self.__('menu.' + title) + '</a>';
  });

  return result;
});

// hexo.extend.helper.register('canonical_url', function(lang) {
//   var path = this.page.canonical_path;
//   if (lang && lang !== 'en') path = lang + '/' + path;

//   return this.config.url + '/' + path;
// });

hexo.extend.helper.register('page_nav', function(lang) {
  return;
});

hexo.extend.helper.register('url_for_lang', function(path) {
  var lang = this.page.lang;
  var url = this.url_for(path);

  if (lang !== 'en' && url[0] === '/') url = '/' + lang + url;

  return url;
});

hexo.extend.helper.register('raw_link', function(path) {
  return 'https://github.com/andytudhope/conditional-token-docs/edit/master/source/' + path;
});

hexo.extend.helper.register('page_anchor', function(str) {
  var $ = cheerio.load(str, {decodeEntities: false});
  var headings = $('h1, h2, h3, h4, h5, h6');

  if (!headings.length) return str;

  headings.each(function() {
    var id = $(this).attr('id');

    $(this)
      .addClass('article-heading')
      .append('<a class="article-anchor" href="#' + id + '" aria-hidden="true"></a>');
  });

  return $.html();
});

hexo.extend.helper.register('lunr_index', function(data) {
  var index = lunr(function() {
    this.field('name', {boost: 10});
    this.field('tags', {boost: 50});
    this.field('description');
    this.ref('id');

    _.sortBy(data, 'name').forEach((item, i) => {
      this.add(_.assign({ id: i }, item));
    });
  });

  return JSON.stringify(index);
});

hexo.extend.helper.register('canonical_path_for_nav', function() {
  var path = this.page.canonical_path;

  if (startsWith(path, 'docs/') || startsWith(path, 'api/')) {
    return path;
  }
  return '';

});

hexo.extend.helper.register('lang_name', function(lang) {
  var data = this.site.data.languages[lang];
  return data.name || data;
});

hexo.extend.helper.register('disqus_lang', function() {
  var lang = this.page.lang;
  var data = this.site.data.languages[lang];

  return data.disqus_lang || lang;
});

hexo.extend.helper.register('hexo_version', function() {
  return this.env.version;
});

hexo.extend.helper.register('show_lang', function(lang) {
  if(this.page.lang != 'en'){
    return '/' + this.page.lang;
  }
});

hexo.extend.helper.register('language_selector', function() {

  var languages = this.site.data.languages,
      shortLang = this.page.lang,
      list = '',
      self = this,
      languageSelector = '';

  if(Object.keys(languages).length > 1){
    
    _.each(languages, function(l, i) {
  
      var path = self.page.path,
          active = '';
  
      if(i == shortLang){
        shortLang = l.short;
        active = 'active';
      }
  
      path = path.replace("index.html", "");
  
      if(path.substr(0, path.indexOf('/')) == shortLang){
        path = path.split(shortLang + '/')[1];
      }
  
      if(i != 'en'){
        path = i + '/' + path;
      }
  
      list += '<li class="'+ active +'"><a href="/'+ path +'">'+ l.long + '</a></li>';
  
    });
  
    languageSelector = `
      <div class="language-selector">
        <a href="#" class="language-selector-trigger btn btn-arrow">${shortLang}</a>
        <ul>
          ${list}
        </ul>
      </div>
    `;
  
  }
  
  return languageSelector;

});
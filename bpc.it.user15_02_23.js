F// ==UserScript==
// @name            Bypass Paywalls Clean - it
// @version         3.0.0.3
// @downloadURL     https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.it.user.js
// @updateURL       https://gitlab.com/magnolia1234/bypass-paywalls-clean-filters/-/raw/main/userscript/bpc.it.user.js
// @match           *://*.it/*
// @match           *://*.eastwest.eu/*
// @match           *://*.quotidiano.net/*
// ==/UserScript==

(function() {
  'use strict';

window.setTimeout(function () {

var it_ilmessaggero_domains = ['corriereadriatico.it', 'ilgazzettino.it', 'ilmattino.it', 'ilmessaggero.it', 'quotidianodipuglia.it'];
var it_quotidiano_domains = ['ilgiorno.it', 'ilrestodelcarlino.it', 'iltelegrafolivorno.it', 'lanazione.it', 'quotidiano.net'];
var domain;

if (matchDomain('corriere.it')) {
  if (window.location.pathname.endsWith('_amp.html')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  } else {
    let url = window.location.href;
    if (url.includes('_preview.shtml')) {
      window.setTimeout(function () {
        window.location.href = url.replace('_preview.shtml', '.shtml').split('?')[0];
      }, 500);
    }
  }
}

else if (matchDomain('corrieredellosport.it')) {
  if (!window.location.pathname.startsWith('/amp/')) {
    let paywall = document.querySelector('div[class^="MainTextTruncated_paragraph__"]');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
    let ads = document.querySelectorAll('div[class^="AdUnit_placeholder"]');
    removeDOMElement(...ads);
  } else {
    let ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('eastwest.eu')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('style');
    paywall.classList.remove('paywall');
    let intro = document.querySelectorAll('div#testo_articolo > p, div#testo_articolo > h3');
    let offerta = document.querySelectorAll('div.offerta_abbonamenti');
    removeDOMElement(...intro, ...offerta);
  }
}

if (matchDomain('espresso.repubblica.it')) {
  if (!window.location.pathname.match(/\amp(\/)?$/)) {
    let paywall = document.querySelector('div#paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  } else {
    amp_unhide_access_hide('="showContent"', '="NOT (showContent)"', 'amp-ad, amp-embed');
    let logo = document.querySelector('div.logo-container > a');
    if (logo) {
      logo.innerText = "L'Espresso";
      logo.style.color = 'white';
    }
    let placeholders = document.querySelectorAll('figure > amp-img[placeholder][src]');
    for (let elem of placeholders) {
      let img = document.createElement('img');
      img.src = elem.getAttribute('src');
      elem.parentNode.replaceChild(img, elem);
    }
    let inline_videos = document.querySelectorAll('div.video-container > iframe[src]');
    for (let video of inline_videos) {
      let elem = document.createElement('a');
      elem.href = video.src;
      elem.innerText = '>>> external video-link';
      elem.target = '_blank';
      video.parentNode.replaceChild(elem, video);
    }
  }
}

else if (matchDomain('gazzetta.it')) {
  if (window.location.pathname.endsWith('_preview.shtml')) {
    window.setTimeout(function () {
      window.location.href = window.location.href.split('?')[0].replace('_preview', '') + '?gaa_at=g';
    }, 500);
  } else if (window.location.pathname.endsWith('_amp.shtml'))
    ampToHtml();
}

else if (matchDomain('ilfattoquotidiano.it')) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, div#_4sVideoContainer');
    let comments = document.querySelector('div.content.comments');
    removeDOMElement(comments);
  } else if (url.split('?')[0].match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
    let paywall = document.querySelector('div.read-more');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.split('?')[0] + 'amp';
    }
  }
}

else if (matchDomain('ilfoglio.it')) {
  if (window.location.pathname.endsWith('/amp/')) {
    amp_unhide_subscr_section('amp-ad, [class^="adv-"], div#gmpVideoContainer');
  } else {
    let paywall = document.querySelector('div.paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
    let ads = document.querySelectorAll('.advertisement');
    removeDOMElement(...ads);
  }
}

else if (matchDomain('ilmanifesto.it')) {
  window.setTimeout(function () {
    if (window.location.pathname.match(/((\w)+(\-)+){3,}/)) {
      let paywall = document.querySelector('div[class^="PostPaywall_PostPaywall__"]');
      if (paywall) {
        removeDOMElement(paywall);
        let json_script = document.querySelector('script#__NEXT_DATA__');
        if (json_script) {
          let json = JSON.parse(json_script.innerText);
          if (json && json.props.pageProps.content && json.props.pageProps.content.content) {
            let article_new = json.props.pageProps.content.content;
            let article = document.querySelector('div.ArticleBody');
            if (article) {
              article.innerHTML = '';
              let parser = new DOMParser();
              let doc = parser.parseFromString('<div>' + article_new + '</div>', 'text/html');
              let content_new = doc.querySelector('div');
              article.appendChild(content_new);
            }
          } else
            window.location.reload(true);
        }
      }
    }
    let service_page = document.querySelector('div.service-page');
    if (service_page) {
      window.setTimeout(function () {
        window.location.reload(true);
      }, 1000);
    }
  }, 2000);
}

else if (matchDomain(['iltirreno.it', 'lanuovasardegna.it'])) {
  if (window.location.pathname.includes('/news/')) {
    let paywall = document.querySelector('div.MuiBox-root > h4.MuiTypography-h4');
    if (paywall) {
      let article = document.querySelector('div.MuiGrid-root.MuiGrid-grid-sm-7 > div');
      if (article) {
        removeDOMElement(paywall.parentNode);
        try {
          fetch(window.location.href)
          .then(response => {
            if (response.ok) {
              response.text().then(html => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let json = doc.querySelector('script#__NEXT_DATA__');
                if (json) {
                  let article_new = JSON.parse(json.text).props.pageProps.article.content;
                  if (article_new) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString('<div>' + article_new + '</div>', 'text/html');
                    let content_new = doc.querySelector('div');
                    article.innerHTML = '';
                    article.appendChild(content_new);
                  }
                }
              })
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
    window.setTimeout(function () {
      let banners = document.querySelectorAll('div.MuiSnackbar-root, div.css-16cchgy');
      removeDOMElement(...banners);
    }, 1000);
  }
}

else if (matchDomain(it_ilmessaggero_domains)) {
  if (window.location.pathname.toLowerCase().includes('/amp/')) {
    amp_unhide_subscr_section('amp-ad, amp-embed');
  }
}

else if (matchDomain(it_quotidiano_domains)) {
  if (window.location.pathname.endsWith('/amp')) {
    amp_unhide_access_hide('="c.customGranted"', '="NOT c.customGranted"', 'amp-ad, amp-embed, amp-fx-flying-carpet, .watermark-adv');
  } else {
    let paywall = document.querySelector('div[data-testid="paywall-container"]');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (!amphtml)
      amphtml = {href: window.location.pathname + '/amp'};
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('italiaoggi.it')) {
  let paywall = document.querySelector('div.boxAbb');
  if (paywall) {
    let overlay = document.querySelector('div.article-locked-overlay');
    removeDOMElement(paywall, overlay);
    let article_locked = document.querySelector('div.article-locked');
    if (article_locked) {
      article_locked.classList.remove('article-locked');
      let json_script = getArticleJsonScript();
      if (json_script) {
        let json = JSON.parse(json_script.text);
        if (json) {
          let json_text = json.articleBody;
          let content = article_locked.querySelector('section');
          if (json_text && content) {
            if (json_text && content) {
              let parser = new DOMParser();
              json_text = json_text.replace(/&amp;apos;/g, "'").replace(/;/g, '');
              let doc = parser.parseFromString('<div><section>' + json_text + '</section></div>', 'text/html');
              let content_new = doc.querySelector('div');
              content.parentNode.replaceChild(content_new, content);
            }
          }
        }
      }
    }
  }
}

else if (matchDomain('lescienze.it')) {
  let paywall = document.querySelector('.paywall-adagio');
  let body_paywall = document.querySelector('#detail-body-paywall');
  let shade = document.querySelector('.shade');
  removeDOMElement(paywall, body_paywall, shade);
  let detail_body_hidden = document.querySelectorAll('.detail_body[hidden]');
  for (let elem of detail_body_hidden) {
    elem.removeAttribute('hidden');
    elem.removeAttribute('style');
  }
}

}, 1000);

// General Functions

function matchDomain(domains, hostname) {
  var matched_domain = false;
  if (!hostname)
    hostname = window.location.hostname;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function setCookie(name, value, domain, path, days) {
  window.localStorage.clear();
  var max_age = days * 24 * 60 * 60;
  document.cookie = name + "=" + (value || "") + "; domain=" + domain + "; path=" + path + "; max-age=" + max_age;
}

function removeDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.remove();
  }
}

function amp_iframes_replace(weblink = false, source = '') {
  let amp_iframes = document.querySelectorAll('amp-iframe' + (source ? '[src*="'+ source + '"]' : ''));
  let elem;
  for (let amp_iframe of amp_iframes) {
    if (!weblink) {
      elem = document.createElement('iframe');
      Object.assign(elem, {
        src: amp_iframe.getAttribute('src'),
        sandbox: amp_iframe.getAttribute('sandbox'),
        height: amp_iframe.getAttribute('height'),
        width: 'auto',
        style: 'border: 0px;'
      });
      amp_iframe.parentElement.insertBefore(elem, amp_iframe);
      removeDOMElement(amp_iframe);
    } else {
      let video_link = document.querySelector('a#bpc_video_link');
      if (!video_link) {
        amp_iframe.removeAttribute('class');
        elem = document.createElement('a');
        elem.id = 'bpc_video_link';
        elem.innerText = 'Video-link';
        elem.setAttribute('href', amp_iframe.getAttribute('src'));
        elem.setAttribute('target', '_blank');
        amp_iframe.parentElement.insertBefore(elem, amp_iframe);
      }
    }
  }
}

function amp_unhide_subscr_section(amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let preview = document.querySelector('[subscriptions-section="content-not-granted"]');
  removeDOMElement(preview);
  let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
  for (let elem of subscr_section)
    elem.removeAttribute('subscriptions-section');
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  removeDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function amp_unhide_access_hide(amp_access = '', amp_access_not = '', amp_ads_sel = 'amp-ad, .ad', replace_iframes = true, amp_iframe_link = false, source = '') {
  let access_hide = document.querySelectorAll('[amp-access' + amp_access + '][amp-access-hide]:not([amp-access="error"], [amp-access^="message"])');
  for (elem of access_hide)
    elem.removeAttribute('amp-access-hide');
  if (amp_access_not) {
    let amp_access_not_dom = document.querySelectorAll('[amp-access' + amp_access_not + ']');
    removeDOMElement(...amp_access_not_dom);
  }
  let amp_ads = document.querySelectorAll(amp_ads_sel);
  removeDOMElement(...amp_ads);
  if (replace_iframes)
    amp_iframes_replace(amp_iframe_link, source);
}

function ampToHtml() {
  window.setTimeout(function () {
    let canonical = document.querySelector('link[rel="canonical"]');
    window.location.href = canonical.href;
  }, 500);
}

function getArticleJsonScript() {
  let scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let json_script;
  for (let script of scripts) {
    if (script.innerText.match(/"(articlebody|text)":/i)) {
      json_script = script;
      break;
    }
  }
  return json_script;
}

})();

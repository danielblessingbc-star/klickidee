// KlicKIdee: Kopieren, Filter, Zwei-Klick-Player. Keine Fremdinhalte, keine Cookies.
(function () {
  'use strict';

  // Kopieren
  document.querySelectorAll('[data-kopieren]').forEach(function (btn) {
    var quelle = document.getElementById(btn.getAttribute('data-kopieren'));
    var meldung = btn.closest('.prompt-karte').querySelector('.kopiert');
    var timer;
    btn.addEventListener('click', function () {
      var text = quelle.textContent;
      var fertig = function () {
        btn.textContent = 'Kopiert ✓';
        meldung.textContent = 'Der Prompt ist in der Zwischenablage.';
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = 'Kopieren'; meldung.textContent = ''; }, 2500);
      };
      var notfall = function () {
        var r = document.createRange(); r.selectNodeContents(quelle);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { if (document.execCommand('copy')) { fertig(); return; } } catch (e) { /* weiter */ }
        meldung.textContent = 'Der Text ist markiert. Kopiere ihn mit Strg+C (am Handy: lange tippen, Kopieren).';
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(fertig, notfall);
      } else { notfall(); }
    });
  });

  // Filter der Prompt-Bibliothek
  var filter = document.querySelector('[data-filter]');
  if (filter) {
    filter.hidden = false;
    var karten = Array.prototype.slice.call(document.querySelectorAll('[data-karten] .karte'));
    var leer = document.querySelector('[data-leer]');
    var suche = document.getElementById('suche');
    var zustand = { thema: '', aufgabe: '' };
    var anwenden = function () {
      var q = suche.value.trim().toLowerCase();
      var sichtbar = 0;
      karten.forEach(function (k) {
        var ok = (!zustand.thema || k.getAttribute('data-thema') === zustand.thema) &&
          (!zustand.aufgabe || k.getAttribute('data-aufgabe').split('|').indexOf(zustand.aufgabe) > -1) &&
          (!q || k.getAttribute('data-text').indexOf(q) > -1);
        k.hidden = !ok; if (ok) { sichtbar++; }
      });
      leer.hidden = sichtbar > 0;
    };
    filter.querySelectorAll('.chips').forEach(function (gruppe) {
      var name = gruppe.getAttribute('data-gruppe');
      var setze = function (wert) {
        zustand[name] = wert;
        gruppe.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-wert') === wert)); });
        anwenden();
      };
      gruppe.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) { setze(c.getAttribute('data-wert')); } });
      gruppe.setZustand = setze;
    });
    suche.addEventListener('input', anwenden);
    var t = new URLSearchParams(location.search).get('thema');
    var g = filter.querySelector('[data-gruppe="thema"]');
    if (t && g.querySelector('[data-wert="' + t + '"]')) { g.setZustand(t); }
  }

  // Zwei-Klick-Player: erst nach Klick wird YouTube geladen (youtube-nocookie.com)
  document.querySelectorAll('[data-youtube]').forEach(function (box) {
    var start = box.querySelector('.player-start');
    start.addEventListener('click', function () {
      var id = box.getAttribute('data-youtube');
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) { return; }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      f.title = box.getAttribute('data-titel');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      start.replaceWith(f);
      f.focus();
    });
  });

  // Untermenü "Inhalte": Klick außerhalb oder Escape schließt es
  var dd = document.querySelector('.inhalte');
  if (dd) {
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) { dd.open = false; } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { dd.open = false; } });
  }
})();

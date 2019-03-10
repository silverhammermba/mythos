'use strict';

// count array elements with a certain property
Array.prototype.count = function(fun) {
	var c = 0;
	for (var i = 0; i < this.length; ++i)
		if (fun(this[i])) ++c;
	return c;
};

// shuffle array in place (thanks StackOverflow!)
Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
};

// filter an array by a regex or regex pattern
Array.prototype.filterReg = function(pat) {
	if (!(pat instanceof RegExp)) pat = new RegExp(pat);
	return this.filter(function(x) { return x.match(pat); });
}

// for manipulating tokens
function loseToken(arrow) {
	var p = arrow.nextSibling;
	var count = parseInt(p.innerHTML, 10);
	if (count === 0) return;
	p.innerHTML = count - 1;
	save();
}
function addToken(arrow) {
	var p = arrow.previousSibling;
	var count = parseInt(p.innerHTML, 10);
	p.innerHTML = count + 1;
	save();
}

function hide(x) {
	var card = x.parentNode;
	card.classList.add('discarded');
	save();
}

// check if we can show the "Build" button
function tryShowBuild() {
	var sao = document.getElementById("ao").value !== "";
	var sdb = document.getElementById("method").value !== "";
	document.getElementById("build").style.display = sao && sdb ? 'block' : 'none';
}

// change the deck building description
function methodChange(select) {
	var descs = document.getElementsByClassName('desc');
	for (var i = 0; i < descs.length; ++i) descs[i].style.display = 'none';
	if (select.value == "") return;
	document.getElementById(select.value).style.display = 'block';

	tryShowBuild();
}

// update percentage display for custom distribution
function customPerc() {
	// get sliders and convert to proportions
	var easy = parseInt(document.getElementById("easyp").value, 10);
	var normal = parseInt(document.getElementById("normalp").value, 10);
	var hard = parseInt(document.getElementById("hardp").value, 10);
	var total = easy + normal + hard;
	if (total == 0) {
		easy = normal = hard = 1 / 3;
	} else {
		easy /= total;
		normal /= total;
		hard /= total;
	}

	document.getElementById("easyd").innerHTML = Math.floor(easy * 100);
	document.getElementById("normald").innerHTML = Math.floor(normal * 100);
	document.getElementById("hardd").innerHTML = Math.floor(hard * 100);
}

// build a mythos deck from the available (and already shuffled!) cards with the given color counts
function randBuild(avail, counts) {
	var gren = avail.filterReg(/^gren/);
	var yelw = avail.filterReg(/^yelw/);
	var blue = avail.filterReg(/^blue/);

	var d = [];

	for (var i = 3; i-- > 0;) {
		var stage = [];
		for (var j = 0; j < counts[i * 3    ]; ++j) stage.push(gren.pop());
		for (var j = 0; j < counts[i * 3 + 1]; ++j) stage.push(yelw.pop());
		for (var j = 0; j < counts[i * 3 + 2]; ++j) stage.push(blue.pop());
		d = d.concat(stage.shuffle());
	}

	return d;
}

/* if we ever don't have enough cards, it's because we're doing hard/easy-only.
 * this displays a message warning that we had to add some normal cards
 */
function checkNormal(cards) {
	var num = cards.count(function(card) { return card.match(/-N/); });
	if (num > 0) {
		alert("Not enough Mythos cards of that difficulty. Added " + num + " normal card" + (num > 1 ? 's' : '') + ". Buy some expansions!");
	}
}

// add a starting rumor to deck from avail
function startingRumor(d, avail) {
	// find rumors not already in the deck
	var rumors = avail.filter(function(card) { return card.match(/^blue/) && d.indexOf(card) < 0; });
	// add one
	d.push(rumors.pop());
	return d;
}

// build a staged deck
function stagedBuild(avail, counts, strtrum) {
	var easy = avail.filterReg(/-E/);
	var normal = avail.filterReg(/-N/);
	var hard = avail.filterReg(/-H/);

	var gren = hard.filterReg(/^gren/);
	var yelw = hard.filterReg(/^yelw/);
	var blue = hard.filterReg(/^blue/);

	var d = [];

	// third stage, no blue
	var stage = [];
	for (var j = 0; j < counts[6]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[7]; ++j) stage.push(yelw.pop());
	for (var j = 0; j < counts[8]; ++j) stage.push(blue.pop());
	d = d.concat(stage.shuffle());

	var hard_rumors = document.getElementById('rudf').checked;

	// second stage
	gren = normal.filterReg(/^gren/);
	yelw = normal.filterReg(/^yelw/);
	blue = (hard_rumors ? hard : normal).filterReg(/^blue/);

	stage = [];
	for (var j = 0; j < counts[3]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[4]; ++j) stage.push(yelw.pop());
	for (var j = 0; j < counts[5]; ++j) stage.push(blue.pop());
	d = d.concat(stage.shuffle());

	// first stage
	gren = easy.filterReg(/^gren/);
	yelw = easy.filterReg(/^yelw/);
	blue = (hard_rumors ? normal : easy).filterReg(/^blue/);

	stage = [];
	for (var j = 0; j < counts[0]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[1]; ++j) stage.push(yelw.pop());
	for (var j = 0; j < counts[2]; ++j) stage.push(blue.pop());
	d = d.concat(stage.shuffle());

	if (strtrum) d.push(blue.pop());

	return d;
}

// build a deck with custom difficulty distribution
function customBuild(avail, counts, strtrum, desc) {
	// get sliders and convert to proportions
	var easy = parseInt(document.getElementById("easyp").value, 10);
	var normal = parseInt(document.getElementById("normalp").value, 10);
	var hard = parseInt(document.getElementById("hardp").value, 10);
	var total = easy + normal + hard;
	if (total == 0) {
		easy = normal = hard = 1 / 3;
	} else {
		easy /= total;
		normal /= total;
		hard /= total;
	}

	desc.innerHTML = "Custom: " + Math.round(easy * 100) + "% easy, " + Math.round(normal * 100) + "% normal, " + Math.round(hard * 100) + "% hard.";

	// build mini green/yellow/blue decks with those proportions
	var colors = {};
	var names = ['gren', 'yelw', 'blue'];
	var random = 0;

	for (var i = 0; i < names.length; ++i) {
		var color = avail.filterReg('^' + names[i]);
		var ecr = color.filterReg(/-E/);
		var ncr = color.filterReg(/-N/);
		var hcr = color.filterReg(/-H/);

		colors[names[i]] = [];

		total = counts[i] + counts[i + 3] + counts[i + 6];
		// if starting rumor, ensure we have an extra blue
		if (strtrum && i == 2) ++total;

		var nume = Math.round(total * easy);
		var numn = Math.round(total * normal);
		var numh = Math.round(total * hard);

		// if rounding caused us to have an extra card
		if (nume + numn + numh === total + 1) {
			var reme = normal + hard;
			var remn = hard + easy;
			var remh = easy + normal;

			// remove 0s from the distribution first
			if (nume === 0) reme = 0;
			if (numn === 0) remn = 0;
			if (numh === 0) remh = 0;

			var ttot = reme + remn + remh;
			reme /= ttot;
			remn /= ttot;
			remh /= ttot; // XXX technically unneeded, but whatevs

			// remove the extra card randomly, with probability proportional to the original distribution
			var r = Math.random();
			if (r < reme) {
				--nume;
			} else if (r < reme + remn) {
				--numn;
			} else {
				--numh;
			}

			// XXX shouldn't happen, that means we got a 0 probability result
			if (nume < 0 || numn < 0 || numh < 0) console.log("custom build failed!", total, easy, normal, hard);
		}
		// if rounding caused us to need another card
		else if (nume + numn + numh === total - 1) {
			// randomly add the card based on the original distribution
			var r = Math.random();
			if (r < easy) {
				++nume;
			} else if (r < easy + normal) {
				++numn;
			} else {
				++numh;
			}
		// XXX shouldn't get here, rounding should only ever be off by one
		} else if (nume + numn + numh !== total) {
			console.log("custom build failed!", total, easy, normal, hard);
		}

		for (var j = 0; j < nume && ecr.length; ++j) colors[names[i]].push(ecr.pop());
		for (var j = 0; j < numn && ncr.length; ++j) colors[names[i]].push(ncr.pop());
		for (var j = 0; j < numh && hcr.length; ++j) colors[names[i]].push(hcr.pop());

		// just add random cards if we don't have enough
		if (colors[names[i]].length < total) {
			random += total - colors[names[i]].length;
			var extra = ecr.concat(ncr).concat(hcr).shuffle();
			while (colors[names[i]].length < total) colors[names[i]].push(extra.pop());
		}
	}

	if (random > 0) alert("Not enough Mythos cards of that difficulty. Added " + random + " random card" + (random > 1 ? 's' : '') + ". Buy some expansions!");

	// put them all back together and then build normally
	var d = randBuild(colors['gren'].concat(colors['yelw']).concat(colors['blue']).shuffle(), counts);
	if (strtrum) startingRumor(d, colors['blue']);
	return d;
}

/* global state */
var drawn = 0; // how many cards have been drawn
var deck; // cards in Mythos deck
var avail; // available cards (for adding later)
var start = undefined; // game start time
var prevtime = 0; // elapsed time from previous session
var save_version = 1; // to avoid conflicts in save info

function save() {
	localStorage.drawn = drawn;
	localStorage.deck = JSON.stringify(deck);
	localStorage.avail = JSON.stringify(avail);
	localStorage.prevtime = start ? prevtime + (new Date() - start) / 1000 : prevtime;
	localStorage.save_version = save_version;

	// store stage counts
	var counts = [];
	for (var i = 0; i < 9; ++i) {
		counts[i] = parseInt(document.getElementById('c' + i).innerHTML, 10);
	}
	localStorage.counts = JSON.stringify(counts);

	// find additional card state, such as discarded/num tokens
	var state = [];
	var cards = document.querySelectorAll('.card');
	for (var i = 0; i < cards.length; ++i) {
		var discarded = cards[i].classList.contains('discarded');
		var tokens = Array.from(cards[i].querySelectorAll('.token p')).map(function(p) { return parseInt(p.innerHTML, 10); });
		state.push([discarded, tokens]);
	}

	localStorage.state = JSON.stringify(state);
}

function load() {
	deck = JSON.parse(localStorage.deck);
	avail = JSON.parse(localStorage.avail);
	prevtime = parseFloat(localStorage.prevtime);

	for (var i = 0; i < parseInt(localStorage.drawn, 10); ++i) {
		draw(false, false);
	}

	var counts = JSON.parse(localStorage.counts);
	for (var i = 0; i < 9; ++i) {
		document.getElementById('c' + i).innerHTML = counts[i];
	}

	var cards = document.querySelectorAll('.card');
	var state = JSON.parse(localStorage.state);
	for (var i = 0; i < cards.length; ++i) {
		if (state[i][0]) {
			cards[i].classList.add('discarded');
		}

		var tokens = cards[i].querySelectorAll('.token p');
		for (var j = 0; j < state[i][1].length; ++j) {
			tokens[j].innerHTML = state[i][1][j];
		}
	}

	startPlay();
}

function startPlay() {
	// remove form, show the card area
	document.forms[0].style.display = 'none';
	document.getElementById('play').style.display = 'block';
	document.getElementById('etc').style.display = 'block';

	// start the timer
	start = new Date();
}

function buildDeck() {
	var form = document.forms[0];
	var desc = document.getElementById('desc');

	// build regexp for selecting expansion cards
	var expansions = 'B';
	for (var i = 0; i < form['expansion'].length; ++i) {
		if (form['expansion'][i].checked) expansions += form['expansion'][i].value;
	}

	avail = cards.filterReg('-.[' + expansions + ']').shuffle();

	var premythos;
	var precount;
	switch(form['prelude'].value) {
		case 'web':
			avail = avail.filter(function(card) { return !card.match(/^blue-16/); });
			if (form['ao'].value !== 'Atlach-Nacha') {
				premythos = 'blue-16-HB3';
				precount = 4;
			}
			break;
		case 'yellow':
			avail = avail.filter(function(card) { return !card.match(/^blue-35/); });
			if (form['ao'].value !== 'Hastur') {
				premythos = 'blue-35-NC1';
				precount = 2;
			}
			break;
		case 'north':
			avail = avail.filter(function(card) { return !card.match(/^blue-22/); });
			if (form['ao'].value !== 'Ithaqua') {
				premythos = 'blue-22-NB4';
				precount = 6;
			}
			break;
	}

	var counts = ancient_ones[form['ao'].value];
	var strtrum = form['startingrumor'].checked;

	switch (form['method'].value) {
		case 'random':
			deck = randBuild(avail, counts);
			if (strtrum) startingRumor(deck, avail);
			desc.innerHTML = 'Normal setup.';
			break;
		case 'nohard':
			avail = avail.filterReg(/-[EN]/);
			deck = randBuild(avail, counts);
			if (strtrum) startingRumor(deck, avail);
			desc.innerHTML = 'No hard cards.';
			break;
		case 'noeasy':
			avail = avail.filterReg(/-[NH]/);
			deck = randBuild(avail, counts);
			if (strtrum) startingRumor(deck, avail);
			desc.innerHTML = 'No easy cards.';
			break;
		case 'easy':
			avail = avail.filterReg(/-N/).concat(avail.filterReg(/-E/));
			deck = randBuild(avail, counts);
			if (strtrum) startingRumor(deck, avail);
			checkNormal(deck);
			desc.innerHTML = 'All easy cards.';
			break;
		case 'hard':
			avail = avail.filterReg(/-N/).concat(avail.filterReg(/-H/));
			deck = randBuild(avail, counts);
			if (strtrum) startingRumor(deck, avail);
			checkNormal(deck);
			desc.innerHTML = 'All hard cards.';
			break;
		case 'staged':
			deck = stagedBuild(avail, counts, strtrum);
			desc.innerHTML = 'Staged deck.';
			break;
		case 'custom':
			deck = customBuild(avail, counts, strtrum, desc);
			break;
	}

	// update the remaining counts
	for (var i = 0; i < 9; ++i) {
		document.getElementById('c' + i).innerHTML = counts[i];
	}

	// TODO verify deck with counts?

	if (premythos) {
		deck.push(premythos);

		document.getElementById('c2').innerHTML = counts[2] + 1;
		draw(false, false);

		var cs = document.getElementsByClassName('card');
		cs[cs.length - 1].querySelector('.eldritch p').innerHTML = precount;
	}

	// handle starting rumor
	if (strtrum) {
		document.getElementById('c2').innerHTML = counts[2] + 1;
		draw(false, false);
	}

	save();
	startPlay();
}

function hideShow() {
	document.getElementById('cards').classList.toggle('showcards');
}

// return how many eldritch tokens this card starts with (-1 for reckoning but no tokens)
function tokenCount(str) {
	var match = str.match(/(\d|-)c?.jpg/);
	if (match) return match[1] === '-' ? -1 : parseInt(match[1], 10);
	return null;
}

// indicate if this card accumulates clues
function hasClues(str) {
	var match = str.match(/c.jpg/);
	if (match) return true;
	return false;
}

// TODO if autodiscard, should double check if any previous cards should be discarded
function draw(autodiscard, dosave) {
	if (drawn == deck.length) return false;

	var div = document.getElementById('cards');

	var name = deck[deck.length - ++drawn];

	// decrement remaining count
	var i;
	switch (name.substr(0, 4)) {
		case 'gren':
			i = 0;
			break;
		case 'yelw':
			i = 1;
			break;
		case 'blue':
			i = 2;
			break;
	}

	for (var j = 0; j < 3; ++j) {
		if (parseInt(document.getElementById('c' + (i + j * 3)).innerHTML, 10) > 0)
		{
			document.getElementById('c' + (i + j * 3)).innerHTML -= 1;
			break;
		}
	}

	// create card
	var card_container = document.createElement('div');
	card_container.classList.add('cardContainer');


	var card = document.createElement('div');
	card.classList.add('card');
	card.style.backgroundImage = "url('cards/" + name + ".jpg')";

	card_container.appendChild(card);

	var count = tokenCount(card.style.backgroundImage);
	if (count !== null) {
		var html = '';
		if (hasClues(card.style.backgroundImage)) {
			html +=
				'<div class="clue token">'
					+ '<a class="arrow left" href="#" onclick="loseToken(this); return false">◀</a>'
					+ '<p>0</p>'
					+ '<a class="arrow right" href="#" onclick="addToken(this); return false">▶</a>'
				+ '</div>';
		}
		if (count >= 0) {
			html +=
				'<div class="eldritch token">'
					+ '<a class="arrow left" href="#" onclick="loseToken(this); return false">◀</a>'
					+ '<p>' + count + '</p>'
					+ '<a class="arrow right" href="#" onclick="addToken(this); return false">▶</a>'
				+ '</div>';
		}
		html += '<a class="close" href="#" onclick="hide(this); return false">✖</a>';

		card.innerHTML = html;
	}

	// Unimaginable Horror
	if (name === 'yelw-08-HP') {
		card.innerHTML = '<button type="button" class="action" onclick="unimaginable()" id="unimaginable">Shuffle and draw a Mythos card.</button>';
	}

	// The Storm
	if (name === 'yelw-28-HB') {
		card.innerHTML = '<button type="button" class="action" onclick="storm()" id="storm">Draw a <span class="rumor">Rumor</span> Mythos card.</button>';
	}

	// Abandon Hope
	if (name === 'yelw-72-HS') {
		card.innerHTML = '<button type="button" class="action" onclick="abandon()" id="abandon">Draw 3 yellow Mythos cards from the game box.</button>';
	}

	// add the card
	div.insertBefore(card_container, div.firstChild);

	// if the previously drawn card doesn't have a close button, remove it
	if (autodiscard && card.nextSibling && !card.nextSibling.getElementsByClassName('close').length) {
		card.nextSibling.classList.add('discarded');
	}

	if (drawn == deck.length) {
		document.getElementById('draw').disabled = "disabled";
		localStorage.save_version = -1; // intentionally invalid, to clear save
	}

	if (dosave === undefined || dosave === true) save();
	return true;
}

// shuffle in cards to the remainder of the mythos deck
function shuffleDeck(add) {
	var tail = deck.slice(deck.length - drawn, deck.length);
	var head = deck.slice(0, deck.length - drawn);

	if (add) head = head.concat(add);

	var colors = [/^gren/, /^yelw/, /^blue/];

	// adjust counts
	for (var i = 0; i < 3; ++i) {
		var total = 0;

		for (var j = 0; j < 3; ++j) {
			var cell = document.getElementById('c' + (i + j * 3));
			total += parseInt(cell.innerHTML, 10);
			cell.innerHTML = '0';
		}

		for (var j = 0; add && j < add.length; ++j) {
			if (add[j].match(colors[i])) ++total;
		}

		document.getElementById('c' + (i + 6)).innerHTML = total;
	}

	deck = head.shuffle().concat(tail);
}

// discard the top card of the mythos deck
function discardTop() {
	document.getElementsByClassName('card')[0].classList.add('discarded');
}

function eibon() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	var green = avail.filter(function(card) { return card.match(/^gren/) && deck.indexOf(card) < 0; }).pop();
	var yellw = avail.filter(function(card) { return card.match(/^yelw/) && deck.indexOf(card) < 0; }).pop();
	// TODO check for undefined?

	shuffleDeck([green, yellw]);

	// discard three
	for (var i = 0; i < 3; ++i) if (draw(false, false)) discardTop();
	save();
}

function lostTime() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	if (draw(false, false)) discardTop();

	shuffleDeck();

	save();
}

function unimaginable() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	document.getElementById('unimaginable').disabled = "disabled";

	shuffleDeck();

	draw(true);
}

function storm() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	document.getElementById('storm').disabled = "disabled";

	var rumor = avail.filter(function(card) { return card.match(/^blue/) && deck.indexOf(card) < 0; }).pop();
	// TODO check for undefined?

	deck.splice(deck.length - drawn, 0, rumor);

	var cell = document.getElementById('c2');
	cell.innerHTML = parseInt(cell.innerHTML, 10) + 1;

	draw(true);
}

function abandon() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	document.getElementById('abandon').disabled = "disabled";

	var yellows = avail.filter(function(card) { return card.match(/^yelw/) && deck.indexOf(card) < 0; })
	yellows = yellows.slice(yellows.length - 3, yellows.length);
	// TODO check for not enough cards?

	deck.splice(deck.length - drawn, 0, yellows[0], yellows[1], yellows[2]);

	var cell = document.getElementById('c1');
	cell.innerHTML = parseInt(cell.innerHTML, 10) + 3;

	draw(false);
	draw(false);
	draw(false);
}

function newgame() {
	if (!window.confirm("Are you sure? This cannot be undone.")) return;

	// restore global state, discard save
	drawn = 0;
	deck = undefined;
	avail = undefined;
	start = undefined;
	prevtime = 0;
	localStorage.save_version = -1;

	// reshow form
	document.forms[0].style.display = 'block';
	document.getElementById('play').style.display = 'none';
	document.getElementById('etc').style.display = 'none';

	// remove previous cards
	var cards = document.getElementById('cards');
	Array.from(cards.children).forEach(function(card) {
		cards.removeChild(card);
	});
	// re-enable draw button
	document.getElementById('draw').disabled = "";
}

/* card format is
 * COLOR-ID-DIFFICULTY EXPANSION ELDRITCH CLUES
 * with spaces removed
 *
 * COLOR:      blue/yelw/gren
 * ID:         unique ID to avoid name conflicts (not used internally)
 * DIFFICULTY: E/N/H for easy/normal/hard
 * EXPANSION:  single letter code indicating expansion (see index.html)
 * ELDRITCH:   (optional) number of starting eldritch tokens, or - for ongoing but no tokens
 * CLUES:      (optional) a lowercase c if clues can be placed on the card
 */
var cards = [
'blue-00-HR4c', 'blue-01-HR2', 'blue-02-NR-', 'blue-03-NR4', 'blue-04-ER3',
'blue-05-NM3', 'blue-06-EM5', 'blue-07-HM-', 'blue-08-HM3', 'blue-09-NM-',
'blue-10-NM4', 'blue-11-HL3', 'blue-12-NL-', 'blue-13-EB3', 'blue-14-HB-',
'blue-15-HB8', 'blue-16-HB3', 'blue-17-NB-', 'blue-18-HB0', 'blue-19-NB4',
'blue-20-NB-c', 'blue-21-EB-', 'blue-22-NB4', 'blue-23-EB4', 'blue-24-EB4',
'blue-25-ED-', 'blue-26-ND3', 'blue-27-ND3', 'blue-28-ND3c', 'blue-29-HD-',
'blue-30-HD3', 'blue-31-NC-c', 'blue-32-HC2', 'blue-33-HC5', 'blue-34-NC3',
'blue-35-NC1', 'blue-36-HP-', 'blue-37-EP-', 'blue-38-NP4', 'blue-39-EP3',
'blue-40-HP0', 'blue-41-NP4', 'blue-42-EC4', 'blue-43-HS-', 'blue-44-NS3',
'blue-45-ES3', 'blue-46-HN0', 'gren-00-ER', 'gren-01-ER', 'gren-02-NR-',
'gren-03-NR-', 'gren-04-NR', 'gren-05-HR-', 'gren-06-HR', 'gren-07-EP-',
'gren-08-EP', 'gren-09-NP', 'gren-10-NP', 'gren-11-HM', 'gren-12-NM',
'gren-13-NL', 'gren-14-HM', 'gren-15-HL', 'gren-16-NB', 'gren-17-EB',
'gren-18-EB', 'gren-19-HB-', 'gren-20-NB', 'gren-21-NB-', 'gren-22-EB',
'gren-23-HM', 'gren-24-EB', 'gren-25-HB', 'gren-26-EB', 'gren-27-HB',
'gren-28-NB', 'gren-29-HB', 'gren-30-NB', 'gren-31-HB', 'gren-32-NB',
'gren-33-NB-', 'gren-34-EM', 'gren-35-NB', 'gren-36-EM', 'gren-37-NM',
'gren-38-NM-', 'gren-39-NM-', 'gren-40-ED', 'gren-41-ED', 'gren-42-ND',
'gren-43-ND-', 'gren-44-ND-', 'gren-45-HD', 'gren-46-HD', 'gren-47-HD',
'gren-48-NC-', 'gren-49-NC', 'gren-50-NC', 'gren-51-EC', 'gren-52-EC',
'gren-54-HC-', 'gren-55-HC', 'gren-56-NC-', 'gren-59-HP', 'gren-60-HP',
'gren-61-HP-', 'gren-62-NP', 'gren-63-HS', 'gren-64-HS-', 'gren-65-NS',
'gren-66-NS', 'gren-67-NS-', 'gren-68-NS', 'gren-69-HS-', 'gren-70-ES',
'gren-71-ES-', 'gren-72-NN', 'gren-73-EN', 'gren-74-EN', 'gren-75-NN',
'gren-76-EN', 'gren-77-NN', 'gren-78-HN', 'gren-79-HN', 'gren-80-NN-',
'yelw-00-NR', 'yelw-01-ER', 'yelw-02-ER', 'yelw-03-HR', 'yelw-04-NR',
'yelw-05-NR', 'yelw-06-HR', 'yelw-07-HR', 'yelw-08-HP', 'yelw-09-NP',
'yelw-10-NP', 'yelw-11-NP', 'yelw-12-HP', 'yelw-13-HP', 'yelw-14-NM',
'yelw-15-HM', 'yelw-16-HM', 'yelw-17-HM', 'yelw-18-HM', 'yelw-19-EM',
'yelw-20-NM', 'yelw-21-EM', 'yelw-22-EM', 'yelw-23-NM', 'yelw-24-NM',
'yelw-25-NL', 'yelw-26-HL', 'yelw-27-NB', 'yelw-28-HB', 'yelw-29-HB',
'yelw-30-NB', 'yelw-31-NB', 'yelw-32-NB', 'yelw-33-NB', 'yelw-34-EB',
'yelw-35-HB', 'yelw-36-EB', 'yelw-37-EB', 'yelw-38-HB', 'yelw-39-NB',
'yelw-40-NB', 'yelw-41-NB', 'yelw-42-EB', 'yelw-43-NB', 'yelw-44-HB',
'yelw-45-EB', 'yelw-46-NB', 'yelw-47-NB', 'yelw-48-ED', 'yelw-49-ED',
'yelw-50-ND', 'yelw-51-ND', 'yelw-52-ND', 'yelw-53-ND', 'yelw-54-ND',
'yelw-55-HD', 'yelw-56-HD', 'yelw-57-HD', 'yelw-58-NC', 'yelw-59-NC',
'yelw-60-NC', 'yelw-61-EC', 'yelw-62-EC', 'yelw-63-HC', 'yelw-64-HC',
'yelw-65-HC', 'yelw-66-NC', 'yelw-67-NC', 'yelw-68-EP', 'yelw-69-EP',
'yelw-70-HS', 'yelw-71-HS', 'yelw-72-HS', 'yelw-73-NS', 'yelw-74-NS',
'yelw-75-NS', 'yelw-76-NS', 'yelw-77-HS', 'yelw-78-NS', 'yelw-79-ES',
'yelw-80-ES', 'yelw-81-ES', 'yelw-82-NN', 'yelw-83-EN', 'yelw-84-EN',
'yelw-85-EN', 'yelw-86-HN', 'yelw-87-NN', 'yelw-88-HN', 'yelw-89-NN',
'yelw-90-NN', 'yelw-91-HN'
];

// most you need is 10 green, 11 yellow, 3 blue (for starting rumor)
var ancient_ones = {
                             // G1 Y1 B1 G2 Y2 B2 G3 Y3 B3
	'Yog-Sothoth':              [0, 2, 1, 2, 3, 1, 3, 4, 0],
	'Hypnos':                   [0, 2, 1, 2, 3, 1, 3, 4, 0],
	'Nephren-Ka':               [0, 2, 2, 1, 3, 0, 3, 4, 0],
	'Cthulhu':                  [0, 2, 2, 1, 3, 0, 3, 4, 0],
	'Hastur':                   [0, 2, 2, 2, 3, 0, 3, 5, 0],
	'Syzygy':                   [0, 2, 2, 3, 3, 0, 3, 5, 0],
	'Ithaqua':                  [0, 2, 2, 4, 2, 0, 2, 4, 0],
	'Yig':                      [1, 2, 1, 2, 3, 1, 2, 4, 0],
	'Azathoth':                 [1, 2, 1, 2, 3, 1, 2, 4, 0],
	'Shub-Niggurath':           [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Atlach-Nacha':             [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Abhoth':                   [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Rise of the Elder Things': [2, 2, 1, 3, 3, 1, 4, 4, 0],
	"Shudde M'ell":             [0, 2, 2, 4, 2, 0, 2, 4, 0],
	"Antediluvium":             [1, 2, 1, 2, 3, 1, 2, 4, 0],
	"Nyarlathotep":             [1, 2, 1, 2, 3, 1, 2, 4, 0]
};

window.onload = function() {
	// populate the Ancient One dropdown
	var select = document.getElementById("ao");
	var names = Object.keys(ancient_ones).sort();
	for (var i = 0; i < names.length; ++i) {
		var opt = document.createElement('option');
		opt.value = names[i];
		opt.innerHTML = names[i];
		select.appendChild(opt);
	}

	// set initial description/display for deck building method
	methodChange(document.getElementById("method"));
	customPerc();

	// set up the game timer
	var elm = document.getElementById('timer');
	setInterval(function() {
		if (start === undefined) return;
		var elapsed = Math.floor((new Date() - start) / 1000 + prevtime);
		elm.innerHTML = Math.floor(elapsed / 60) + ":" + ("0" + (elapsed % 60)).slice(-2);
	}, 1000);

	// load previous game, if present
	if (parseInt(localStorage.save_version, 10) === save_version) {
		load();
	}
}

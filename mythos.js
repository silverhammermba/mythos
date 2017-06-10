'use strict';

function loseToken(arrow) {
	var p = arrow.nextSibling;
	var count = parseInt(p.innerHTML, 10);
	if (count === 0) return;
	p.innerHTML = count - 1;
}

function addToken(arrow) {
	var p = arrow.previousSibling;
	var count = parseInt(p.innerHTML, 10);
	p.innerHTML = count + 1;
}

function hide(x) {
	var card = x.parentNode;
	card.parentNode.removeChild(card);
}

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

function tryShowBuild() {
	var sao = document.getElementById("ao").value !== "";
	var sdb = document.getElementById("method").value !== "";
	document.getElementById("build").style.display = sao && sdb ? 'block' : 'none';
}

function methodChange(select) {
	var descs = document.getElementsByClassName('desc');
	for (var i = 0; i < descs.length; ++i) descs[i].style.display = 'none';
	document.getElementById(select.value).style.display = 'block';

	tryShowBuild();
}

// build a mythos deck from the used cards with the given color counts
function randBuild(used, counts) {
	var gren = used.filter(function(card) { return card.match(/^gren/); }).shuffle();
	var yelw = used.filter(function(card) { return card.match(/^yelw/); }).shuffle();
	var blue = used.filter(function(card) { return card.match(/^blue/); }).shuffle();

	var deck = [];

	for (var i = 3; i-- > 0;) {
		var stage = [];
		for (var j = 0; j < counts[i * 3    ]; ++j) stage.push(gren.pop());
		for (var j = 0; j < counts[i * 3 + 1]; ++j) stage.push(yelw.pop());
		for (var j = 0; j < counts[i * 3 + 2]; ++j) stage.push(blue.pop());
		deck = deck.concat(stage.shuffle());
	}

	return deck;
}

// add normal difficulty cards if there aren't enough in used for the given counts
function addNormal(used, all, counts) {
	var normal = all.filter(function(card) { return card.match(/-N/); }).shuffle();

	var names = ['gren', 'yelw', 'blue'];
	var added = 0;

	for (var j = 0; j < names.length; ++j) {
		var total = counts[j] + counts[j + 3] + counts[j + 6];
		var reg = new RegExp('^' + names[j]);
		var have = used.count(function(card) { return card.match(reg); });
		if (have < total) {
			var extra = normal.filter(function(card) { return card.match(reg); });
			for (var i = 0; i < total - have; ++i) used.push(extra.pop());
			added += total - have;
		}
	}

	if (added > 0) alert("Not enough Mythos cards of that difficulty. Added " + added + " normal card" + (added > 1 ? 's' : '') + ". Buy some expansions!");

	return used;
}

// add a starting rumor to deck from used
function startingRumor(deck, used) {
	// find rumors not already in the deck
	var rumors = used.filter(function(card) { return card.match(/^blue/) && deck.indexOf(card) < 0; }).shuffle();
	// add one
	deck.push(rumors.pop());
}

// build a staged deck
function stagedBuild(used, counts, strtrum) {
	var easy = used.filter(function(card) { return card.match(/-E/); });
	var normal = used.filter(function(card) { return card.match(/-N/); });
	var hard = used.filter(function(card) { return card.match(/-H/); });

	var gren = hard.filter(function(card) { return card.match(/^gren/); }).shuffle();
	var yelw = hard.filter(function(card) { return card.match(/^yelw/); }).shuffle();

	var deck = [];

	// third stage, no blue
	var stage = [];
	for (var j = 0; j < counts[6]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[7]; ++j) stage.push(yelw.pop());
	deck = deck.concat(stage.shuffle());

	var hard_rumors = document.getElementById('rudf').checked;

	// second stage
	gren = normal.filter(function(card) { return card.match(/^gren/); }).shuffle();
	yelw = normal.filter(function(card) { return card.match(/^yelw/); }).shuffle();
	var blue = (hard_rumors ? hard : normal).filter(function(card) { return card.match(/^blue/); }).shuffle();

	stage = [];
	for (var j = 0; j < counts[3]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[4]; ++j) stage.push(yelw.pop());
	for (var j = 0; j < counts[5]; ++j) stage.push(blue.pop());
	deck = deck.concat(stage.shuffle());

	// first stage
	gren = easy.filter(function(card) { return card.match(/^gren/); }).shuffle();
	yelw = easy.filter(function(card) { return card.match(/^yelw/); }).shuffle();
	blue = (hard_rumors ? normal : easy).filter(function(card) { return card.match(/^blue/); }).shuffle();

	stage = [];
	for (var j = 0; j < counts[0]; ++j) stage.push(gren.pop());
	for (var j = 0; j < counts[1]; ++j) stage.push(yelw.pop());
	for (var j = 0; j < counts[2]; ++j) stage.push(blue.pop());
	deck = deck.concat(stage.shuffle());

	if (strtrum) deck.push(blue.pop());

	return deck;
}

// build a deck with custom difficulty distribution
function customBuild(used, counts, strtrum, desc) {
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

	desc.innerHTML = "Custom: " + Math.floor(easy * 100) + "% easy, " + Math.floor(normal * 100) + "% normal, " + Math.floor(hard * 100) + "% hard.";

	// build mini green/yellow/blue decks with those proportions
	var colors = {};
	var names = ['gren', 'yelw', 'blue'];
	var random = 0;

	for (var i = 0; i < names.length; ++i) {
		var reg = new RegExp('^' + names[i]);
		var color = used.filter(function(card) { return card.match(reg); }).shuffle();
		var ecr = color.filter(function(card) { return card.match(/-E/); });
		var ncr = color.filter(function(card) { return card.match(/-N/); });
		var hcr = color.filter(function(card) { return card.match(/-H/); });

		colors[names[i]] = [];

		total = counts[i] + counts[i + 3] + counts[i + 6];
		// if starting rumor, ensure we have an extra blue
		if (strtrum && i == 2) ++total;
		var nume = Math.ceil(total * easy);
		var numn = Math.ceil(total * normal);
		var numh = Math.ceil(total * hard);
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
	var deck = randBuild(colors['gren'].concat(colors['yelw']).concat(colors['blue']), counts);
	if (strtrum) startingRumor(deck, colors['blue']);
	return deck;
}

var deck;

// warning to show when leaving after deck has been built
function leaveWarn(e) {
	var msg = 'Are you sure you want to leave this page? Your Mythos deck will be lost.';

	(e || window.event).returnValue = msg;
	return msg;
}

function buildDeck() {
	var form = document.forms[0];
	var desc = document.getElementById('desc');

	// build regexp for selecting expansion cards
	var expansions = 'B';
	for (var i = 0; i < form['expansion'].length; ++i) {
		if (form['expansion'][i].checked) expansions += form['expansion'][i].value;
	}
	expansions = new RegExp('-.[' + expansions + ']');

	var used = cards.filter(function(card) { return card.match(expansions); });

	var counts = ancient_ones[form['ao'].value];
	var strtrum = form['startingrumor'].checked;

	switch (form['method'].value) {
		case 'random':
			deck = randBuild(used, counts);
			if (strtrum) startingRumor(deck, used);
			desc.innerHTML = 'Normal setup.';
			break;
		case 'nohard':
			used = used.filter(function(card) { return card.match(/-[EN]/); });
			deck = randBuild(used, counts);
			if (strtrum) startingRumor(deck, used);
			desc.innerHTML = 'No hard cards.';
			break;
		case 'noeasy':
			used = used.filter(function(card) { return card.match(/-[NH]/); });
			deck = randBuild(used, counts);
			if (strtrum) startingRumor(deck, used);
			desc.innerHTML = 'No easy cards.';
			break;
		case 'easy':
			var easy = used.filter(function(card) { return card.match(/-E/); });
			// make sure there are enough cards
			deck = randBuild(addNormal(easy, used, counts), counts);
			if (strtrum) startingRumor(deck, easy);
			desc.innerHTML = 'All easy cards.';
			break;
		case 'hard':
			var hard = used.filter(function(card) { return card.match(/-H/); });
			// make sure there are enough cards
			deck = randBuild(addNormal(hard, used, counts), counts);
			if (strtrum) startingRumor(deck, hard);
			desc.innerHTML = 'All hard cards.';
			break;
		case 'staged':
			deck = stagedBuild(used, counts, strtrum);
			desc.innerHTML = 'Staged deck.';
			break;
		case 'custom':
			deck = customBuild(used, counts, strtrum, desc);
			break;
	}

	// update the remaining counts
	for (var i = 0; i < 9; ++i) {
		document.getElementById('c' + i).innerHTML = counts[i];
	}

	// remove form, show the card area
	form.parentNode.removeChild(form);
	document.getElementById('play').style.display = 'block';
	// warn when leaving the page
	window.addEventListener("beforeunload", leaveWarn);

	// TODO verify deck with counts?

	// handle starting rumor
	if (strtrum) {
		document.getElementById('c2').innerHTML = counts[2] + 1;
		draw();
	}
}

function tokenCount(str) {
	var match = str.match(/(\d).jpg/);
	if (match) return parseInt(match[1], 10);
	return null;
}

function draw() {
	if (deck.length === 0) return;

	var div = document.getElementById('cards');

	var name = deck.pop();

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
	var card = document.createElement('div');
	card.classList.add('card');
	card.style.backgroundImage = "url('cards/" + name + ".jpg')";

	var count = tokenCount(card.style.backgroundImage);
	if (count !== null) {
		card.innerHTML =
			'<div class="token">'
				+ '<a class="arrow left" href="#" onclick="loseToken(this)">◀</a>'
				+ '<p>' + count + '</p>'
				+ '<a class="arrow right" href="#" onclick="addToken(this)">▶</a>'
			+ '</div>'
			+ '<a class="close" href="#" onclick="hide(this)">✖</a>';
	}

	div.insertBefore(card, div.firstChild);

	if (deck.length === 0) {
		document.getElementById('draw').disabled = "disabled";
		// safe to navigate away
		window.removeEventListener("beforeunload", leaveWarn);
	}
}

var cards = ['blue-00-HR4', 'blue-01-HR2', 'blue-02-NR0', 'blue-03-NR4',
'blue-04-ER3', 'blue-05-NM3', 'blue-06-EM5', 'blue-07-HM0', 'blue-08-HM3',
'blue-09-NM0', 'blue-10-NM4', 'blue-11-HL3', 'blue-12-NL0', 'blue-13-EB3',
'blue-14-HB0', 'blue-15-HB8', 'blue-16-HB3', 'blue-17-NB0', 'blue-18-HB0',
'blue-19-NB4', 'blue-20-NB0', 'blue-21-EB0', 'blue-22-NB4', 'blue-23-EB4',
'blue-24-EB4', 'blue-25-ED0', 'blue-26-ND3', 'blue-27-ND3', 'blue-28-ND3',
'blue-29-HD0', 'blue-30-HD3', 'blue-31-NC0', 'blue-32-HC2', 'blue-33-HC5',
'blue-34-NC3', 'blue-35-NC1', 'blue-36-HP0', 'blue-37-EP0', 'blue-38-NP4',
'blue-39-EP3', 'blue-40-HP0', 'blue-41-NP4', 'blue-42-EC4', 'gren-00-ER',
'gren-01-ER', 'gren-02-NR0', 'gren-03-NR0', 'gren-04-NR', 'gren-05-HR0',
'gren-06-HR', 'gren-07-EP0', 'gren-08-EP', 'gren-09-NP', 'gren-10-NP',
'gren-11-HM', 'gren-12-NM', 'gren-13-NL', 'gren-14-HM', 'gren-15-HL',
'gren-16-NB', 'gren-17-EB', 'gren-18-EB', 'gren-19-HB0', 'gren-20-NB',
'gren-21-NB0', 'gren-22-EB', 'gren-23-HM', 'gren-24-EB', 'gren-25-HB',
'gren-26-EB', 'gren-27-HB', 'gren-28-NB', 'gren-29-HB', 'gren-30-NB',
'gren-31-HB', 'gren-32-NB', 'gren-33-NB0', 'gren-34-EM', 'gren-35-NB',
'gren-36-EM', 'gren-37-NM', 'gren-38-NM0', 'gren-39-NM0', 'gren-40-ED',
'gren-41-ED', 'gren-42-ND', 'gren-43-ND0', 'gren-44-ND0', 'gren-45-HD',
'gren-46-HD', 'gren-47-HD', 'gren-48-NC0', 'gren-49-NC', 'gren-50-NC',
'gren-51-EC', 'gren-52-EC', 'gren-54-HC0', 'gren-55-HC', 'gren-56-NC0',
'gren-59-HP', 'gren-60-HP', 'gren-61-HP0', 'gren-62-NP', 'yelw-00-NR',
'yelw-01-ER', 'yelw-02-ER', 'yelw-03-HR', 'yelw-04-NR', 'yelw-05-NR',
'yelw-06-HR', 'yelw-07-HR', 'yelw-08-HP', 'yelw-09-NP', 'yelw-10-NP',
'yelw-11-NP', 'yelw-12-HP', 'yelw-13-HP', 'yelw-14-NM', 'yelw-15-HM',
'yelw-16-HM', 'yelw-17-HM', 'yelw-18-HM', 'yelw-19-EM', 'yelw-20-NM',
'yelw-21-EM', 'yelw-22-EM', 'yelw-23-NM', 'yelw-24-NM', 'yelw-25-NL',
'yelw-26-HL', 'yelw-27-NB', 'yelw-28-HB', 'yelw-29-HB', 'yelw-30-NB',
'yelw-31-NB', 'yelw-32-NB', 'yelw-33-NB', 'yelw-34-EB', 'yelw-35-HB',
'yelw-36-EB', 'yelw-37-EB', 'yelw-38-HB', 'yelw-39-NB', 'yelw-40-NB',
'yelw-41-NB', 'yelw-42-EB', 'yelw-43-NB', 'yelw-44-HB', 'yelw-45-EB',
'yelw-46-NB', 'yelw-47-NB', 'yelw-48-ED', 'yelw-49-ED', 'yelw-50-ND',
'yelw-51-ND', 'yelw-52-ND', 'yelw-53-ND', 'yelw-54-ND', 'yelw-55-HD',
'yelw-56-HD', 'yelw-57-HD', 'yelw-58-NC', 'yelw-59-NC', 'yelw-60-NC',
'yelw-61-EC', 'yelw-62-EC', 'yelw-63-HC', 'yelw-64-HC', 'yelw-65-HC',
'yelw-66-NC', 'yelw-67-NC', 'yelw-68-EP', 'yelw-69-EP'];

// most you need is 9 green, 10 yellow, 3 blue (for starting rumor)
var ancient_ones = {
                             // G1 Y1 B1 G2 Y2 B2 G3 Y3 B3
	'Yog-Sothoth':              [0, 2, 1, 2, 3, 1, 3, 4, 0],
	'Hypnos':                   [0, 2, 1, 2, 3, 1, 3, 4, 0],
	'Nephren-Ka':               [0, 2, 2, 1, 3, 0, 3, 4, 0],
	'Cthulhu':                  [0, 2, 2, 1, 3, 0, 3, 4, 0],
	'Hastur':                   [0, 2, 2, 2, 3, 0, 3, 5, 0],
	'Syzygy':                   [0, 2, 2, 3, 3, 0, 5, 5, 0],
	'Ithaqua':                  [0, 2, 2, 4, 2, 0, 2, 4, 0],
	'Yig':                      [1, 2, 1, 2, 3, 1, 2, 4, 0],
	'Azathoth':                 [1, 2, 1, 2, 3, 1, 2, 4, 0],
	'Shub-Niggurath':           [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Atlach-Nacha':             [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Abhoth':                   [1, 2, 1, 3, 2, 1, 2, 4, 0],
	'Rise of the Elder Things': [2, 2, 1, 3, 3, 1, 4, 4, 0]
};

window.onload = function() {
	var select = document.getElementById("ao");
	var names = Object.keys(ancient_ones).sort();
	for (var i = 0; i < names.length; ++i) {
		var opt = document.createElement('option');
		opt.value = names[i];
		opt.innerHTML = names[i];
		select.appendChild(opt);
	}

	methodChange(document.getElementById("method"));
}

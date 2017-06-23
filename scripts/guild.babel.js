import cheerio from 'cheerio'
import request from 'request'

export function getGuildUrl(server, realm, name, page) {
	return `http://${server.toLowerCase()}.battle.net/wow/en/guild/${realm.toLowerCase()}/${encodeURIComponent(name)}/roster?sort=rank&dir=a&page=${page}`
}

export function getCharacterUrl(server, realm, name) {
	let locale = 'gb'

	if (server.toLowerCase() === 'us') {
		locale = 'us'
	}

	return `https://worldofwarcraft.com/en-${locale}/character/${realm.toLowerCase()}/${name}`
}

export function getData(options) {
	const urls = getPages(options.pages).map(page => getGuildUrl(options.server, options.realm, options.name, page))

	return new Promise((resolve, reject) => {
		Promise.all(urls.map(getHTML)).then(data => data.join()).then(resolve).catch(reject)
	})
}

export function parseHTML(html, options) {
	const $ = cheerio.load(html)

	let people = {
		leadership: [],
		members: []
	}

	options.ranks.forEach(rank => {
		$(`.rank[data-raw=${rank}]`, html).each(function() {
			let person = {}

			person.name = $(this).siblings('.name').find('a').text()
			person.race = $(this).siblings('.race').find('span').data('tooltip')
			person.class = $(this).siblings('.cls').find('span').data('tooltip')
			person.rank = $(this).data('raw')

			if (options.images) {
				person.img = {
					race: person.race.toLowerCase().replace(/\s+/, '-'),
					class: person.class.toLowerCase().replace(/\s+/, '-')
				}
			}

			if (options.about) {
				person.about = null
			}

			if (options.leadership.indexOf(rank) >= 0) {
				people.leadership.push(person)
			} else {
				people.members.push(person)
			}
		})
	})

	if (options.sort === 'name') {
		people.leadership.sort(sortByName)
		people.members.sort(sortByName)
	} else {
		people.leadership.sort(sortByRank)
		people.members.sort(sortByRank)
	}

	if (!options.rank) {
		people.leadership.map(removeRank)
		people.members.map(removeRank)
	}

	return people
}

export function getPortraits(people, options) {
	return new Promise((resolve, reject) => {
		const leadership = Promise.all(people.leadership.map(person => getPortrait(person, options)))
		const members = Promise.all(people.members.map(person => getPortrait(person, options)))

		Promise.all([leadership, members]).then(data => {
			people.leadership = data.shift()
			people.members = data.shift()

			resolve(people)
		}).catch(reject)
	})
}

const getPortrait = function(person, options) {
	return new Promise((resolve, reject) => {
		const url = getCharacterUrl(options.server, options.realm, person.name)

		getHTML(url).then(html => {
			const $ = cheerio.load(html)

			person.portrait = $('a[data-analytics=export-character-image]').attr('href').replace('main', 'avatar')

			resolve(person)
		}).catch(reject)
	})
}

const getPages = function(total) {
	let pages = [],
		index = 1

	while (index <= total) {
		pages.push(index)

		index++
	}

	return pages
}

const getHTML = function(url) {
	return new Promise((resolve, reject) => {
		request({
			url: url,
			encoding: 'utf8'
		}, (err, res, body) => {
			if (err) {
				return reject(err)
			}

			resolve(body)
		})
	})
}

const sortByName = function(one, two) {
	return one.name.localeCompare(two.name)
}

const sortByRank = function(one, two) {
	if (one.rank === two.rank) {
		return sortByName(one, two)
	}

	return one.rank.toString().localeCompare(two.rank.toString())
}

const removeRank = function(person) {
	delete person.rank

	return person
}

export default function Guild(options) {
	getData(options).then(html => parseHTML(html, options)).then(people => options.portraits ? getPortraits(people, options) : people).then(people => JSON.stringify(people, null, options.pretty && 2)).then(json => console.log(json))
}

import fs from 'fs'

import Handlebars from 'handlebars'
import gulp from 'gulp'

import webserver from 'gulp-server-livereload'

import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import clean from 'gulp-clean-css'

import babel from 'gulp-babel'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'

gulp.task('stylesheets', () => {
	return gulp.src('./src/stylesheets/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(clean())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./public/assets/css/'))
})

gulp.task('scripts', () => {
	return gulp.src('./src/scripts/*.js')
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js/'))
})

gulp.task('templates', () => {
	const load = (name) => {
		return new Promise(resolve => {
			fs.readFile(`./src/templates/${name}.hbs`, {
				encoding: 'utf8'
			}, (err, template) => {
				resolve({
					name: name,
					template: template
				})
			})
		})
	}

	fs.readFile('./src/data.json', {
		encoding: 'utf8'
	}, (err, data) => {
		let requests = [
			load('nav'),
			load('header'),
			load('main'),
			load('footer'),
		]

		Promise.all(requests)
			.then(templates => templates.forEach(template => Handlebars.registerPartial(template.name, template.template)))
			.then(() => load('layout'))
			.then(layout => Handlebars.compile(layout.template))
			.then(template => fs.writeFileSync('./public/index.html', template(JSON.parse(data))))
			.catch(e => console.error(e))
	})
})

gulp.task('webserver', function() {
	gulp.src('./public')
		.pipe(webserver({
			livereload: true,
			open: true
		}))
})

gulp.task('default', ['templates', 'stylesheets', 'scripts', 'webserver'], () => {
	gulp.watch(['./src/templates/*.hbs', './src/data.json'], ['templates'])

	gulp.watch('./src/stylesheets/*.scss', ['stylesheets'])
	gulp.watch('./src/scripts/*.js', ['scripts'])
})

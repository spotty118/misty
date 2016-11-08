import fs from 'fs'

import Handlebars from 'handlebars'
import gulp from 'gulp'

import livereload from 'gulp-livereload'

import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import clean from 'gulp-clean-css'

import babel from 'gulp-babel'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'

import data from './src/data.json'

gulp.task('stylesheets', () => {
	return gulp.src('./src/stylesheets/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(clean())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./public/assets/css/'))
		.pipe(livereload())
})

gulp.task('scripts', () => {
	return gulp.src('./src/scripts/*.js')
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/assets/js/'))
		.pipe(livereload())
})

gulp.task('templates', () => {
	let loadTemplate = (name) => {
		return new Promise(resolve => {
			fs.readFile(`./src/templates/${name}.hbs`, {
				encoding: 'utf-8'
			}, (err, template) => {
				resolve({
					name: name,
					template: template
				})
			})
		})
	}

	Promise.all([
		loadTemplate('nav'),
		loadTemplate('header'),
		loadTemplate('main'),
		loadTemplate('footer'),
	])
		.then(templates => templates.forEach(template => Handlebars.registerPartial(template.name, template.template)))
		.then(() => loadTemplate('layout'))
		.then(layout => Handlebars.compile(layout.template))
		.then(template => fs.writeFileSync('./public/index.html', template(data)))
		.catch(e => console.error(e))
})

gulp.task('default', () => {
	livereload.listen()

	gulp.watch('./public/index.html', [() => livereload()])
	gulp.watch(['./src/templates/*.hbs', './src/data.json'], ['templates'])

	gulp.watch('./src/stylesheets/*.scss', ['stylesheets'])
	gulp.watch('./src/scripts/*.js', ['scripts'])
})

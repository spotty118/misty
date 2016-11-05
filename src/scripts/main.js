$(document).ready(() => {
	$('a', '#nav').on('click', function(e) {
		e.preventDefault()

		let link = $(this).attr('href'),
			target = $(link)

		$('html, body').stop(true, true).animate({
			scrollTop: target.position().top - 48
		})
	})

	$('.frame').prepend('<div class="top"></div><div class="right"></div><div class="bottom"></div><div class="left"></div><div class="corner-top"></div><div class="corner-bottom"></div>')

	$('button').wrapInner('<div class="text">')
	$('button').prepend('<div class="left"></div><div class="middle"></div><div class="right"></div><div class="light"></div>')

	$('input, textarea', 'form').on('focus', function() {
		$(this).closest('.frame').addClass('hover')
	})

	$('input, textarea', 'form').on('blur', function() {
		$(this).closest('.frame').removeClass('hover')
	})

	$('label', '.class-selection').on('click', function(e) {
		$('label', '.class-selection').removeClass('selected')

		$(this).addClass('selected')
	})
})

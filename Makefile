.PHONY: default jshint

default:
	@echo "No default rule"

jshint:
	find chrome/js -maxdepth 1 -name "*.js" -exec jshint {} \;	

screenshots/cropped/: screenshots/raw/
	convert screenshots/raw/screenshot-* -resize 1280x -crop 1280x800+0+0 screenshots/cropped/1280x800/screenshot.png
	convert screenshots/raw/promo-* -resize 440x -crop 440x280+0+0 screenshots/cropped/440x280/promo.png
	convert screenshots/raw/promo-* -resize 920x -crop 920x680+0+0 screenshots/cropped/920x680/promo.png
	convert screenshots/raw/promo-* -resize 1400x -crop 1400x560+0+0 screenshots/cropped/1400x560/promo.png

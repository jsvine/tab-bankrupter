.PHONY: default jshint

default:
	@echo "No default rule"

jshint:
	find chrome/js -maxdepth 1 -name "*.js" -exec jshint {} \;	

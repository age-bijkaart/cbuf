# see vars.mk for info on what $(tools), $(libs) etc could be
$(tools): %: $(node)/% # non-essential but supports e.g. 'make js-beautify'
$(call dirof, $(tools)): $(node)/%: 
	npm install --save-dev $(@F)

$(nbin)/babel: $(call dirof, $(babeltools))
$(nbin)/eslint: $(call dirof, $(linttools)) eslintrc.json
# first babel tools, then babel runtime
$(node)/babel-runtime: $(call dirof,$(babeltools))

$(libs): %: $(node)/% # supports e.g. 'make pg'
$(call dirof, $(libs)): $(node)/%: 
	npm install --save $(@F)

#
#### .es7 -> .js ######################################################
# 
%.js: %.es7 $(nbin)/babel 
	babel $< --out-file $@ && chmod ugo+x $@
#
#### (un)install, clean, check, doc ###################################
#
# Install simply makes sure that all involved files are available, e.g.
# .es7 files will have been babelized to .js files.
install: $(configfiles) $(datafiles) $(bashscripts) $(tools) $(libs) $(src:%.es7=%.js) doc
	
uninstall clean: 
	@rm -fr $(datafiles) $(node) $(bashscripts) doc *.js \
		package-lock.json LOG error-words.txt

check: install $(tst:%.es7=%.js) $(bashscripts)
	@./$(tst:%.es7=%.js) && \
	echo "Test $(tst) OK" 

lint: install $(nbin)/eslint babel-eslint
	@eslint --config eslintrc.json *.es7 && echo "Eslint OK"

%.md: %.es7 
	jsdoc2md \
		--param-list-format list \
		--configure ./jsdoc.conf \
		--global-index-format grouped \
		--no-cache \
		--private \
		--separators \
		--example-lang js \
		$< > $@

# README.md: README.hbs $(src)
# 	jsdoc2md \
# 		--template README.hbs \
# 		--param-list-format list \
# 		--configure ./jsdoc.conf \
# 		--global-index-format grouped \
# 		--no-cache \
# 		--private \
# 		--separators \
# 		--example-lang js \
# 		--files $(wordlist 2,$(words $^),$^) \
# 		$< > $@
# 

doc: $(docsrc) espell $(mdfiles)
	@for f in $(docsrc); \
	do ./espell $$f || { echo "$$f: spelling error"; exit 1; }; \
	done

npm: install
	npm pack && npm version patch && npm publish

.PHONY: all install uninstall clean check doc $(tools) $(libs)

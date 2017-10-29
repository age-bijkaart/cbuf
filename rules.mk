# see vars.mk for info on what $(tools), $(libs) etc could be
$(tools): %: $(node)/% # non-essential but supports e.g. 'make js-beautify'
$(call dirof, $(tools)): $(node)/%: 
	npm install --save-dev $(@F)

$(nbin)/babel: $(call dirof, $(babeltools))
$(nbin)/eslint: $(call dirof, $(linttools)) eslintrc.json
$(nbin)/jsdoc: $(call dirof, $(doctools))
# first babel tools, then babel runtime
$(node)/babel-runtime: $(call dirof,$(babeltools))

$(libs): %: $(node)/% # supports e.g. 'make pg'
$(call dirof, $(libs)): $(node)/%: 
	npm install --save $(@F)

%.html: espell %.md 
	./$< $(word 2,$^) && pandoc $< >$@
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
install: $(datafiles) $(bashscripts) $(tools) $(libs) $(src:%.es7=%.js) \
	
uninstall clean: 
	rm -fr $(datafiles) $(node) $(bashscripts) doc *.js package-lock.json LOG

check: install $(tst:%.es7=%.js) $(bashscripts)
	@./$(tst:%.es7=%.js) && \
	echo "Test $(tst) OK" 

lint: install $(nbin)/eslint babel-eslint
	@eslint --config eslintrc.json *.es7 && echo "Eslint OK"

#		 --template $(node)/ink-docstrap/template 
doc: $(nbin)/jsdoc $(shell ls *.es7|grep -v test)
	rm -fr doc && mkdir doc && \
		  $< \
		  --verbose \
	  --destination doc \
	  --configure jsdoc.conf \
		  $(filter-out $<, $^) --readme README.md


.PHONY: all install uninstall clean check doc $(tools) $(libs)

include vars.mk
# Check 'vars.mk' for names of lists to which you may want to add
# some files e.g. bashscripts += myscript.sh
#
# tools += babel-eslint
# Below are the standard ones
src = cbuf.es7
tst = cbuf-test.es7 assert-test.es7 
#
# See 'rules.mk' to have an idea what goals are available.
# Here we define the first one which will thus be the default:
# 'make all' is the same as 'make'.
#
# If you want to know what will be done before
# actually doing it, do 'make -n'. E.g. 'make -n clean'.
all: install 
# Another nonstandard rule that combines the 'check' (running test programs)
# with 'lint':
checkall: check lint
#
test-doc: $(nbin)/jsdoc $(shell ls *.es7|grep test) 
	mkdir -p doc/test && \
		  $< \
		  --verbose \
	  --destination doc/test \
	  --configure jsdoc.conf \
		  $(filter-out $<, $^)
mdoc:	doc test-doc
	ssh dv50 rm -fr doc
	ssh dv50 mkdir doc
	scp -r doc/* dv50:doc
mddoc:
# ./$(nbin)/jsdoc2md --config --configure ./jsdoc.conf cbuf.es7 >cbuf.mdc
# ./$(nbin)/jsdoc2md --jsdoc --configure ./jsdoc.conf cbuf.es7 >cbuf.mdj
	./$(nbin)/jsdoc2md --configure ./jsdoc.conf cbuf.es7 >cbuf.md
	pandoc <cbuf.md >cbuf.html
	scp cbuf.html dv50:

#
# A bunch of rules that explain how to make '.js' files from '.es7' files,
# process markdown files etc etc
include rules.mk

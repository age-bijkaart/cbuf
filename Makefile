include vars.mk
# Check 'vars.mk' for names of lists to which you may want to add
# some files e.g. bashscripts += myscript.sh
#
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
all: install doc
# Another nonstandard rule that combines the 'check' (running test programs)
# with 'lint':
checkall: check lint
#
docmd=README.md cbuf.md cbuf-test.md
doc: $(docmd)
#
# A bunch of rules that explain how to make '.js' files from '.es7' files,
# process markdown files etc etc
include rules.mk


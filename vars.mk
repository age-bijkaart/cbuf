ME=$(shell whoami)
node := node_modules
nbin := $(node)/.bin
#
export PATH := $(nbin):$(PATH)
#
# These variables can be expanded in Makefile, e.g.
#  include vars.mk
#  configfiles += more.conf
configfiles=.babelrc eslintrc.json package.json # source files
datafiles=
# source files that make up the module
src=
# source files that make up the tests
tst=
# docsrc are hand written documentation and need spell checking
# these files may also appear in mdfiles
docsrc=README.md
# all markdown files that constitute the documentation
mdfiles=README.md $(src:%.es7=%.md) $(tst:%.es7=%.md)
# 
bashscripts=espell

#
# E.g. dirof someModule = node_modules/someModule
#
dirof=$(addprefix $(node)/, $1)
#
#### Development tools  ###############################################
#
babeltools=babel-cli babel-preset-es2017 babel-preset-es2015 \
	babel-preset-stage-0 babel-plugin-transform-runtime
linttools= eslint babel-eslint
tools=$(babeltools) $(linttools)
#
#### Runtime libs  ###############################################
#
libs=babel-runtime


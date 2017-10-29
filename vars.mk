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
datafiles=README.html # made
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
doctools= jsdoc # ink-docstrap
funtools= esprima
tools=$(babeltools) $(linttools) $(doctools) $(funtools)
#
#### Runtime libs  ###############################################
#
libs=babel-runtime


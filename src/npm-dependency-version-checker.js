'use strict';

const resolve = require('resolve');
const DependencyVersionChecker = require('./dependency-version-checker');

const ALLOWED_ERROR_CODES = [
  // resolve package error codes
  'MODULE_NOT_FOUND',

  // Yarn PnP Error Codes
  'UNDECLARED_DEPENDENCY',
  'MISSING_PEER_DEPENDENCY',
  'MISSING_DEPENDENCY',
];

let pnp;

try {
  pnp = require('pnpapi');
} catch (error) {
  // not in Yarn PnP; not a problem
}

class NPMDependencyVersionChecker extends DependencyVersionChecker {
  constructor(parent, name) {
    super(parent, name);

    let addon = this._parent._addon;

    let target = this.name + '/package.json';
    let basedir = addon.root;

    let jsonPath;

    try {
      jsonPath = pnp
        ? pnp.resolveToUnqualified(target, basedir)
        : resolve.sync(target, { basedir });
    } catch (e) {
      if (ALLOWED_ERROR_CODES.includes(e.code)) {
        jsonPath = null;
      } else {
        throw e;
      }
    }

    this._jsonPath = jsonPath;
    this._type = 'npm';
  }
}

module.exports = NPMDependencyVersionChecker;

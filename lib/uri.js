import qs from 'qs';

const REGEX = /^(?:([^:\/?#]+):\/\/)?((?:([^\/?#@]*)@)?([^\/?#:]*)(?:\:(\d*))?)?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n)*))?/i;

const isStr = o => typeof o === 'string';
const decode = uri => decodeURIComponent(escape(uri));
const isURL = uri => typeof uri === 'string' && REGEX.test(uri);

class URI {
  constructor(uri) {
    this.uri = uri || null;
    if (isURL(uri) && uri.length) {
      this.parts = this.parse(uri);
    } else {
      this.parts = {};
    }
  }

  parse = uri => {
    const parts = decode(uri || '').match(REGEX);
    const auth = (parts[3] || '').split(':');
    const host = auth.length
      ? (parts[2] || '').replace(/(.*\@)/, '')
      : parts[2];
    return {
      uri: parts[0],
      protocol: parts[1],
      host: host,
      hostname: parts[4],
      port: parts[5],
      auth: parts[3],
      user: auth[0],
      password: auth[1],
      path: parts[6],
      search: parts[7],
      query: this.mapSearchParams(parts[7]),
      hash: parts[8]
    };
  };

  mapSearchParams = search => {
    if (typeof search === 'string') {
      return qs.parse(search, { ignoreQueryPrefix: true });
    }
  };

  accessor = type => value => {
    if (value) {
      this.parts[type] = isStr(value) ? decode(value) : value;
      return this;
    }
    this.parts = this.parse(this.build());
    return this.parts[type];
  };

  protocol = host => this.accessor('protocol').call(this, host);

  host = host => this.accessor('host').call(this, host);

  hostname = hostname => this.accessor('hostname').call(this, hostname);

  port = port => this.accessor('port').call(this, port);

  auth = auth => this.accessor('host').call(this, auth);

  user = user => this.accessor('user').call(this, user);

  password = password => this.accessor('password').call(this, password);

  path = path => this.accessor('path').call(this, path);

  search = search => this.accessor('search').call(this, search);

  query = query =>
    query && typeof query === 'object'
      ? this.accessor('query').call(this, query)
      : this.parts.query;

  hash = hash => this.accessor('hash').call(this, hash);

  get = value => this.parts[value] || '';

  build = function() {
    const p = this.parts;
    const buf = [];

    if (p.protocol) buf.push(p.protocol + '://');
    if (p.auth) buf.push(p.auth + '@');
    else if (p.user)
      buf.push(p.user + (p.password ? ':' + p.password : '') + '@');

    if (p.host) {
      buf.push(p.host);
    } else {
      if (p.hostname) buf.push(p.hostname);
      if (p.port) buf.push(':' + p.port);
    }

    if (p.path) buf.push(p.path);
    if (p.query && typeof p.query === 'object') {
      buf.push(
        qs.stringify(p.query, { addQueryPrefix: true, arrayFormat: 'indices' })
      );
    } else if (p.search) {
      buf.push('?' + p.search);
    }

    if (p.hash) {
      if (!p.path) buf.push('/');
      buf.push('#' + p.hash);
    }

    return (this.url = buf
      .filter(function(part) {
        return isStr(part);
      })
      .join(''));
  };
}

const create = uri => new URI(uri);
export default create;

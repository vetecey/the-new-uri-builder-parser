# The New URI Builder & Parse

## Installation

```
npm install the-new-uri-builder-parser
```

## Usage

```
import uri from 'the-new-uri-builder-parser';
```

## Build URI

```javascript
uri()
  .protocol('https')
  .host('m.uber.com')
  .query({
    action: 'setPickup',
    pickup: {
      formatted_address: startLocation.address,
      longitude: startLocation.longitude,
      latitude: startLocation.latitude
    },
    dropoff: {
      formatted_address: endLocation.address,
      longitude: endLocation.longitude,
      latitude: endLocation.latitude
    },
    ...extraQuery
  })
  .build();
// https://m.uber.com?action=setPickup&pickup[formatted_address]=.....
```

### Works for deeplinks too

```javascript
uri()
  .protocol('uber')
  .query({
    action: 'setPickup',
    pickup: {
      formatted_address: startLocation.address,
      longitude: startLocation.longitude,
      latitude: startLocation.latitude
    },
    dropoff: {
      formatted_address: endLocation.address,
      longitude: endLocation.longitude,
      latitude: endLocation.latitude
    }
  })
  .build();

// uber://?action=setPickup&pickup[formatted_address]=.....
```

### Other methods available

```javascript
uri()
  .port('8080')
  .auth('user:pass')
  .path('/bar/foo.xml')
  .hash('hash=1');
```

## Parse URI

```javascript
uri(
  'https://user:pass@m.uber.com:80/test-path/?action=setPickup&pickup[formatted_address]=...#hash=1'
);
url.protocol(); // -> https
url.host(); // -> m.uber.com:80
url.hostname(); // -> m.uber.com
url.port(); // -> 80
url.auth(); // -> { user: 'user', password: 'pass' }
url.user(); // -> user
url.password(); // -> pass
url.path(); // -> /test-path/
url.search(); // -> action=setPickup&pickup[formatted_address]
url.query(); // -> { action: 'setPickup', pickup: { formatted_address = '', .. } }
url.hash(); // -> hash=1
```

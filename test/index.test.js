'use strict';

const assert = require('assert');
const awaitFirst = require('..');
const EventEmitter = require('events');

it('awaitFirst(ee, [ ... ])', function* () {
  const ee = new EventEmitter();
  setTimeout(() => { ee.emit('foo', 'foo'); }, 200);
  setTimeout(() => { ee.emit('bar', 'bar'); }, 100);

  let triggered = false;
  ee.once('foo', () => { triggered = true; });

  const o = yield awaitFirst(ee, [ 'foo', 'bar' ]);
  assert.deepEqual(o, {
    event: 'bar',
    args: [
      'bar',
    ],
  });
  assert(triggered === false);
  assert(ee.listenerCount('foo') === 1);
  assert(ee.listenerCount('bar') === 0);
});

it('awaitFirst(ee, [ "error", ... ])', function* () {
  const ee = new EventEmitter();
  setTimeout(() => { ee.emit('foo', 'foo'); }, 200);
  setTimeout(() => { ee.emit('bar', 'bar'); }, 200);
  setTimeout(() => { ee.emit('error', new Error('mock error')); }, 100);

  try {
    yield awaitFirst(ee, [ 'foo', 'bar', 'error' ]);
    assert(false, 'should not run here');
  } catch (err) {
    assert(err.message === 'mock error');
  }
  assert(ee.listenerCount('foo') === 0);
  assert(ee.listenerCount('bar') === 0);
  assert(ee.listenerCount('error') === 0);
});

it('obj.awaitFirst([ ... ])', function* () {
  const ee = new EventEmitter();
  ee.awaitFirst = awaitFirst;
  setTimeout(() => { ee.emit('foo', 'foo'); }, 200);
  setTimeout(() => { ee.emit('bar', 'bar'); }, 100);

  let triggered = false;
  ee.once('foo', () => { triggered = true; });

  const o = yield ee.awaitFirst([ 'foo', 'bar' ]);
  assert.deepEqual(o, {
    event: 'bar',
    args: [
      'bar',
    ],
  });
  assert(triggered === false);
  assert(ee.listenerCount('foo') === 1);
  assert(ee.listenerCount('bar') === 0);
});

it('obj.awaitFirst([ "error", ... ])', function* () {
  const ee = new EventEmitter();
  ee.awaitFirst = awaitFirst;
  setTimeout(() => { ee.emit('foo', 'foo'); }, 200);
  setTimeout(() => { ee.emit('bar', 'bar'); }, 200);
  setTimeout(() => { ee.emit('error', new Error('mock error')); }, 100);

  try {
    yield awaitFirst(ee, [ 'foo', 'bar', 'error' ]);
    assert(false, 'should not run here');
  } catch (err) {
    assert(err.message === 'mock error');
  }
  assert(ee.listenerCount('foo') === 0);
  assert(ee.listenerCount('bar') === 0);
  assert(ee.listenerCount('error') === 0);
});

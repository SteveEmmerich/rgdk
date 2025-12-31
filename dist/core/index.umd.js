(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rgdk = {}));
}(this, (function (exports) { 'use strict';

    var FPS = 60;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = /*@__PURE__*/ new Error();
                /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function hostReportError(err) {
        setTimeout(function () { throw err; }, 0);
    }

    /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x !== null && typeof x === 'object';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
        function UnsubscriptionErrorImpl(errors) {
            Error.call(this);
            this.message = errors ?
                errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
            return this;
        }
        UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
        return UnsubscriptionErrorImpl;
    })();
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = /*@__PURE__*/ (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._ctorUnsubscribe = true;
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (_parentOrParents instanceof Subscription) {
                _parentOrParents.remove(this);
            }
            else if (_parentOrParents !== null) {
                for (var index = 0; index < _parentOrParents.length; ++index) {
                    var parent_1 = _parentOrParents[index];
                    parent_1.remove(this);
                }
            }
            if (isFunction(_unsubscribe)) {
                if (_ctorUnsubscribe) {
                    this._unsubscribe = undefined;
                }
                try {
                    _unsubscribe.call(this);
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
                }
            }
            if (isArray(_subscriptions)) {
                var index = -1;
                var len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        try {
                            sub.unsubscribe();
                        }
                        catch (e) {
                            errors = errors || [];
                            if (e instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                            }
                            else {
                                errors.push(e);
                            }
                        }
                    }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            var subscription = teardown;
            if (!teardown) {
                return Subscription.EMPTY;
            }
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (!(subscription instanceof Subscription)) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default: {
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
                }
            }
            var _parentOrParents = subscription._parentOrParents;
            if (_parentOrParents === null) {
                subscription._parentOrParents = this;
            }
            else if (_parentOrParents instanceof Subscription) {
                if (_parentOrParents === this) {
                    return subscription;
                }
                subscription._parentOrParents = [_parentOrParents, this];
            }
            else if (_parentOrParents.indexOf(this) === -1) {
                _parentOrParents.push(this);
            }
            else {
                return subscription;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions === null) {
                this._subscriptions = [subscription];
            }
            else {
                subscriptions.push(subscription);
            }
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var rxSubscriber = /*@__PURE__*/ (function () {
        return typeof Symbol === 'function'
            ? /*@__PURE__*/ Symbol('rxSubscriber')
            : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
    })();

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _parentOrParents = this._parentOrParents;
            this._parentOrParents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parentOrParents = _parentOrParents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
    }

    /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function identity(x) {
        return x;
    }

    /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = /*@__PURE__*/ (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                sink.add(operator.call(sink, this.source));
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor =  Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var Action = /*@__PURE__*/ (function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            return _super.call(this) || this;
        }
        Action.prototype.schedule = function (state, delay) {
            return this;
        };
        return Action;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
    var AsyncAction = /*@__PURE__*/ (function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.pending = false;
            return _this;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (this.closed) {
                return this;
            }
            this.state = state;
            var id = this.id;
            var scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && this.delay === delay && this.pending === false) {
                return id;
            }
            clearInterval(id);
            return undefined;
        };
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, delay) {
            var errored = false;
            var errorValue = undefined;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = !!e && e || new Error(e);
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype._unsubscribe = function () {
            var id = this.id;
            var scheduler = this.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            this.work = null;
            this.state = null;
            this.pending = false;
            this.scheduler = null;
            if (index !== -1) {
                actions.splice(index, 1);
            }
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
        };
        return AsyncAction;
    }(Action));

    var Scheduler = /*@__PURE__*/ (function () {
        function Scheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            this.SchedulerAction = SchedulerAction;
            this.now = now;
        }
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            return new this.SchedulerAction(this, work).schedule(state, delay);
        };
        Scheduler.now = function () { return Date.now(); };
        return Scheduler;
    }());

    /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
    var AsyncScheduler = /*@__PURE__*/ (function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            var _this = _super.call(this, SchedulerAction, function () {
                if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                    return AsyncScheduler.delegate.now();
                }
                else {
                    return now();
                }
            }) || this;
            _this.actions = [];
            _this.active = false;
            _this.scheduled = undefined;
            return _this;
        }
        AsyncScheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.schedule(work, delay, state);
            }
            else {
                return _super.prototype.schedule.call(this, work, delay, state);
            }
        };
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this.active) {
                actions.push(action);
                return;
            }
            var error;
            this.active = true;
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (action = actions.shift());
            this.active = false;
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var subscribeToArray = function (array) {
        return function (subscriber) {
            for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        };
    };

    /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
    function scheduleArray(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var i = 0;
            sub.add(scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    sub.add(this.schedule());
                }
            }));
            return sub;
        });
    }

    /** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
    function fromArray(input, scheduler) {
        if (!scheduler) {
            return new Observable(subscribeToArray(input));
        }
        else {
            return scheduleArray(input, scheduler);
        }
    }

    /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var asyncScheduler = /*@__PURE__*/ new AsyncScheduler(AsyncAction);
    var async = asyncScheduler;

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
        __extends(AnimationFrameAction, _super);
        function AnimationFrameAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
        };
        AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                cancelAnimationFrame(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AnimationFrameAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
        __extends(AnimationFrameScheduler, _super);
        function AnimationFrameScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationFrameScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AnimationFrameScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
    var animationFrameScheduler = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function map(project, thisArg) {
        return function mapOperation(source) {
            if (typeof project !== 'function') {
                throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
            }
            return source.lift(new MapOperator(project, thisArg));
        };
    }
    var MapOperator = /*@__PURE__*/ (function () {
        function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
        }
        MapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
        };
        return MapOperator;
    }());
    var MapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var OuterSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var InnerSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(InnerSubscriber, _super);
        function InnerSubscriber(parent, outerValue, outerIndex) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.outerValue = outerValue;
            _this.outerIndex = outerIndex;
            _this.index = 0;
            return _this;
        }
        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
    var subscribeToPromise = function (promise) {
        return function (subscriber) {
            promise.then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, hostReportError);
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = /*@__PURE__*/ getSymbolIterator();

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
    var subscribeToIterable = function (iterable) {
        return function (subscriber) {
            var iterator$1 = iterable[iterator]();
            do {
                var item = void 0;
                try {
                    item = iterator$1.next();
                }
                catch (err) {
                    subscriber.error(err);
                    return subscriber;
                }
                if (item.done) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(item.value);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
            if (typeof iterator$1.return === 'function') {
                subscriber.add(function () {
                    if (iterator$1.return) {
                        iterator$1.return();
                    }
                });
            }
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
    var subscribeToObservable = function (obj) {
        return function (subscriber) {
            var obs = obj[observable]();
            if (typeof obs.subscribe !== 'function') {
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
            }
            else {
                return obs.subscribe(subscriber);
            }
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isPromise(value) {
        return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    /** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
    var subscribeTo = function (result) {
        if (!!result && typeof result[observable] === 'function') {
            return subscribeToObservable(result);
        }
        else if (isArrayLike(result)) {
            return subscribeToArray(result);
        }
        else if (isPromise(result)) {
            return subscribeToPromise(result);
        }
        else if (!!result && typeof result[iterator] === 'function') {
            return subscribeToIterable(result);
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            throw new TypeError(msg);
        }
    };

    /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
        if (innerSubscriber === void 0) {
            innerSubscriber = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        }
        if (innerSubscriber.closed) {
            return undefined;
        }
        if (result instanceof Observable) {
            return result.subscribe(innerSubscriber);
        }
        return subscribeTo(result)(innerSubscriber);
    }

    /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
    var NONE = {};
    function combineLatest() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        var resultSelector = undefined;
        var scheduler = undefined;
        if (isScheduler(observables[observables.length - 1])) {
            scheduler = observables.pop();
        }
        if (typeof observables[observables.length - 1] === 'function') {
            resultSelector = observables.pop();
        }
        if (observables.length === 1 && isArray(observables[0])) {
            observables = observables[0];
        }
        return fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
    }
    var CombineLatestOperator = /*@__PURE__*/ (function () {
        function CombineLatestOperator(resultSelector) {
            this.resultSelector = resultSelector;
        }
        CombineLatestOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
        };
        return CombineLatestOperator;
    }());
    var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(CombineLatestSubscriber, _super);
        function CombineLatestSubscriber(destination, resultSelector) {
            var _this = _super.call(this, destination) || this;
            _this.resultSelector = resultSelector;
            _this.active = 0;
            _this.values = [];
            _this.observables = [];
            return _this;
        }
        CombineLatestSubscriber.prototype._next = function (observable) {
            this.values.push(NONE);
            this.observables.push(observable);
        };
        CombineLatestSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                this.active = len;
                this.toRespond = len;
                for (var i = 0; i < len; i++) {
                    var observable = observables[i];
                    this.add(subscribeToResult(this, observable, undefined, i));
                }
            }
        };
        CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
            if ((this.active -= 1) === 0) {
                this.destination.complete();
            }
        };
        CombineLatestSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
            var values = this.values;
            var oldVal = values[outerIndex];
            var toRespond = !this.toRespond
                ? 0
                : oldVal === NONE ? --this.toRespond : this.toRespond;
            values[outerIndex] = innerValue;
            if (toRespond === 0) {
                if (this.resultSelector) {
                    this._tryResultSelector(values);
                }
                else {
                    this.destination.next(values.slice());
                }
            }
        };
        CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
            var result;
            try {
                result = this.resultSelector.apply(this, values);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return CombineLatestSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
    function fromEvent(target, eventName, options, resultSelector) {
        if (isFunction(options)) {
            resultSelector = options;
            options = undefined;
        }
        if (resultSelector) {
            return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
        }
        return new Observable(function (subscriber) {
            function handler(e) {
                if (arguments.length > 1) {
                    subscriber.next(Array.prototype.slice.call(arguments));
                }
                else {
                    subscriber.next(e);
                }
            }
            setupSubscription(target, eventName, handler, subscriber, options);
        });
    }
    function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isEventTarget(sourceObj)) {
            var source_1 = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            var source_2 = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = function () { return source_2.off(eventName, handler); };
        }
        else if (isNodeStyleEventEmitter(sourceObj)) {
            var source_3 = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = function () { return source_3.removeListener(eventName, handler); };
        }
        else if (sourceObj && sourceObj.length) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        }
        else {
            throw new TypeError('Invalid event target');
        }
        subscriber.add(unsubscribe);
    }
    function isNodeStyleEventEmitter(sourceObj) {
        return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
    }
    function isJQueryStyleEventEmitter(sourceObj) {
        return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
    }
    function isEventTarget(sourceObj) {
        return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
    }

    /** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
    function isNumeric(val) {
        return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
    }

    /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */
    function interval(period, scheduler) {
        if (period === void 0) {
            period = 0;
        }
        if (scheduler === void 0) {
            scheduler = async;
        }
        if (!isNumeric(period) || period < 0) {
            period = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            scheduler = async;
        }
        return new Observable(function (subscriber) {
            subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
            return subscriber;
        });
    }
    function dispatch(state) {
        var subscriber = state.subscriber, counter = state.counter, period = state.period;
        subscriber.next(counter);
        this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
    }

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function scan(accumulator, seed) {
        var hasSeed = false;
        if (arguments.length >= 2) {
            hasSeed = true;
        }
        return function scanOperatorFunction(source) {
            return source.lift(new ScanOperator(accumulator, seed, hasSeed));
        };
    }
    var ScanOperator = /*@__PURE__*/ (function () {
        function ScanOperator(accumulator, seed, hasSeed) {
            if (hasSeed === void 0) {
                hasSeed = false;
            }
            this.accumulator = accumulator;
            this.seed = seed;
            this.hasSeed = hasSeed;
        }
        ScanOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
        };
        return ScanOperator;
    }());
    var ScanSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ScanSubscriber, _super);
        function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
            var _this = _super.call(this, destination) || this;
            _this.accumulator = accumulator;
            _this._seed = _seed;
            _this.hasSeed = hasSeed;
            _this.index = 0;
            return _this;
        }
        Object.defineProperty(ScanSubscriber.prototype, "seed", {
            get: function () {
                return this._seed;
            },
            set: function (value) {
                this.hasSeed = true;
                this._seed = value;
            },
            enumerable: true,
            configurable: true
        });
        ScanSubscriber.prototype._next = function (value) {
            if (!this.hasSeed) {
                this.seed = value;
                this.destination.next(value);
            }
            else {
                return this._tryNext(value);
            }
        };
        ScanSubscriber.prototype._tryNext = function (value) {
            var index = this.index++;
            var result;
            try {
                result = this.accumulator(this.seed, value, index);
            }
            catch (err) {
                this.destination.error(err);
            }
            this.seed = result;
            this.destination.next(result);
        };
        return ScanSubscriber;
    }(Subscriber));

    var obj;
    var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : ( obj = {}, obj["immer-nothing"] = true, obj );
    var DRAFTABLE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-draftable") : "__$immer_draftable";
    var DRAFT_STATE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-state") : "__$immer_state";
    function isDraft(value) {
      return !!value && !!value[DRAFT_STATE];
    }
    function isDraftable(value) {
      if (!value) { return false; }
      return isPlainObject(value) || !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
    }
    function isPlainObject(value) {
      if (!value || typeof value !== "object") { return false; }
      if (Array.isArray(value)) { return true; }
      var proto = Object.getPrototypeOf(value);
      return !proto || proto === Object.prototype;
    }
    var assign = Object.assign || function assign(target, value) {
      for (var key in value) {
        if (has(value, key)) {
          target[key] = value[key];
        }
      }

      return target;
    };
    var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) { return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); } : Object.getOwnPropertyNames;
    function shallowCopy(base, invokeGetters) {
      if ( invokeGetters === void 0 ) invokeGetters = false;

      if (Array.isArray(base)) { return base.slice(); }
      var clone = Object.create(Object.getPrototypeOf(base));
      ownKeys(base).forEach(function (key) {
        if (key === DRAFT_STATE) {
          return; // Never copy over draft state.
        }

        var desc = Object.getOwnPropertyDescriptor(base, key);
        var value = desc.value;

        if (desc.get) {
          if (!invokeGetters) {
            throw new Error("Immer drafts cannot have computed properties");
          }

          value = desc.get.call(base);
        }

        if (desc.enumerable) {
          clone[key] = value;
        } else {
          Object.defineProperty(clone, key, {
            value: value,
            writable: true,
            configurable: true
          });
        }
      });
      return clone;
    }
    function each(value, cb) {
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) { cb(i, value[i], value); }
      } else {
        ownKeys(value).forEach(function (key) { return cb(key, value[key], value); });
      }
    }
    function isEnumerable(base, prop) {
      var desc = Object.getOwnPropertyDescriptor(base, prop);
      return !!desc && desc.enumerable;
    }
    function has(thing, prop) {
      return Object.prototype.hasOwnProperty.call(thing, prop);
    }
    function is(x, y) {
      // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    function clone(obj) {
      if (!isDraftable(obj)) { return obj; }
      if (Array.isArray(obj)) { return obj.map(clone); }
      var cloned = Object.create(Object.getPrototypeOf(obj));

      for (var key in obj) { cloned[key] = clone(obj[key]); }

      return cloned;
    }

    /** Each scope represents a `produce` call. */

    var ImmerScope = function ImmerScope(parent) {
      this.drafts = [];
      this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
      // need to prevent auto-freezing so the unowned draft can be finalized.

      this.canAutoFreeze = true; // To avoid prototype lookups:

      this.patches = null;
    };

    ImmerScope.prototype.usePatches = function usePatches (patchListener) {
      if (patchListener) {
        this.patches = [];
        this.inversePatches = [];
        this.patchListener = patchListener;
      }
    };

    ImmerScope.prototype.revoke = function revoke$1 () {
      this.leave();
      this.drafts.forEach(revoke);
      this.drafts = null; // Make draft-related methods throw.
    };

    ImmerScope.prototype.leave = function leave () {
      if (this === ImmerScope.current) {
        ImmerScope.current = this.parent;
      }
    };
    ImmerScope.current = null;

    ImmerScope.enter = function () {
      return this.current = new ImmerScope(this.current);
    };

    function revoke(draft) {
      draft[DRAFT_STATE].revoke();
    }

    // but share them all instead

    var descriptors = {};
    function willFinalize(scope, result, isReplaced) {
      scope.drafts.forEach(function (draft) {
        draft[DRAFT_STATE].finalizing = true;
      });

      if (!isReplaced) {
        if (scope.patches) {
          markChangesRecursively(scope.drafts[0]);
        } // This is faster when we don't care about which attributes changed.


        markChangesSweep(scope.drafts);
      } // When a child draft is returned, look for changes.
      else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
          markChangesSweep(scope.drafts);
        }
    }
    function createProxy(base, parent) {
      var isArray = Array.isArray(base);
      var draft = clonePotentialDraft(base);
      each(draft, function (prop) {
        proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
      }); // See "proxy.js" for property documentation.

      var scope = parent ? parent.scope : ImmerScope.current;
      var state = {
        scope: scope,
        modified: false,
        finalizing: false,
        // es5 only
        finalized: false,
        assigned: {},
        parent: parent,
        base: base,
        draft: draft,
        copy: null,
        revoke: revoke$1,
        revoked: false // es5 only

      };
      createHiddenProperty(draft, DRAFT_STATE, state);
      scope.drafts.push(draft);
      return draft;
    }

    function revoke$1() {
      this.revoked = true;
    }

    function source(state) {
      return state.copy || state.base;
    } // Access a property without creating an Immer draft.


    function peek(draft, prop) {
      var state = draft[DRAFT_STATE];

      if (state && !state.finalizing) {
        state.finalizing = true;
        var value = draft[prop];
        state.finalizing = false;
        return value;
      }

      return draft[prop];
    }

    function get(state, prop) {
      assertUnrevoked(state);
      var value = peek(source(state), prop);
      if (state.finalizing) { return value; } // Create a draft if the value is unmodified.

      if (value === peek(state.base, prop) && isDraftable(value)) {
        prepareCopy(state);
        return state.copy[prop] = createProxy(value, state);
      }

      return value;
    }

    function set(state, prop, value) {
      assertUnrevoked(state);
      state.assigned[prop] = true;

      if (!state.modified) {
        if (is(value, peek(source(state), prop))) { return; }
        markChanged(state);
        prepareCopy(state);
      }

      state.copy[prop] = value;
    }

    function markChanged(state) {
      if (!state.modified) {
        state.modified = true;
        if (state.parent) { markChanged(state.parent); }
      }
    }

    function prepareCopy(state) {
      if (!state.copy) { state.copy = clonePotentialDraft(state.base); }
    }

    function clonePotentialDraft(base) {
      var state = base && base[DRAFT_STATE];

      if (state) {
        state.finalizing = true;
        var draft = shallowCopy(state.draft, true);
        state.finalizing = false;
        return draft;
      }

      return shallowCopy(base);
    }

    function proxyProperty(draft, prop, enumerable) {
      var desc = descriptors[prop];

      if (desc) {
        desc.enumerable = enumerable;
      } else {
        descriptors[prop] = desc = {
          configurable: true,
          enumerable: enumerable,

          get: function get$1() {
            return get(this[DRAFT_STATE], prop);
          },

          set: function set$1(value) {
            set(this[DRAFT_STATE], prop, value);
          }

        };
      }

      Object.defineProperty(draft, prop, desc);
    }

    function assertUnrevoked(state) {
      if (state.revoked === true) { throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state))); }
    } // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.


    function markChangesSweep(drafts) {
      // The natural order of drafts in the `scope` array is based on when they
      // were accessed. By processing drafts in reverse natural order, we have a
      // better chance of processing leaf nodes first. When a leaf node is known to
      // have changed, we can avoid any traversal of its ancestor nodes.
      for (var i = drafts.length - 1; i >= 0; i--) {
        var state = drafts[i][DRAFT_STATE];

        if (!state.modified) {
          if (Array.isArray(state.base)) {
            if (hasArrayChanges(state)) { markChanged(state); }
          } else if (hasObjectChanges(state)) { markChanged(state); }
        }
      }
    }

    function markChangesRecursively(object) {
      if (!object || typeof object !== "object") { return; }
      var state = object[DRAFT_STATE];
      if (!state) { return; }
      var base = state.base;
      var draft = state.draft;
      var assigned = state.assigned;

      if (!Array.isArray(object)) {
        // Look for added keys.
        Object.keys(draft).forEach(function (key) {
          // The `undefined` check is a fast path for pre-existing keys.
          if (base[key] === undefined && !has(base, key)) {
            assigned[key] = true;
            markChanged(state);
          } else if (!assigned[key]) {
            // Only untouched properties trigger recursion.
            markChangesRecursively(draft[key]);
          }
        }); // Look for removed keys.

        Object.keys(base).forEach(function (key) {
          // The `undefined` check is a fast path for pre-existing keys.
          if (draft[key] === undefined && !has(draft, key)) {
            assigned[key] = false;
            markChanged(state);
          }
        });
      } else if (hasArrayChanges(state)) {
        markChanged(state);
        assigned.length = true;

        if (draft.length < base.length) {
          for (var i = draft.length; i < base.length; i++) { assigned[i] = false; }
        } else {
          for (var i$1 = base.length; i$1 < draft.length; i$1++) { assigned[i$1] = true; }
        }

        for (var i$2 = 0; i$2 < draft.length; i$2++) {
          // Only untouched indices trigger recursion.
          if (assigned[i$2] === undefined) { markChangesRecursively(draft[i$2]); }
        }
      }
    }

    function hasObjectChanges(state) {
      var base = state.base;
      var draft = state.draft; // Search for added keys and changed keys. Start at the back, because
      // non-numeric keys are ordered by time of definition on the object.

      var keys = Object.keys(draft);

      for (var i = keys.length - 1; i >= 0; i--) {
        var key = keys[i];
        var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

        if (baseValue === undefined && !has(base, key)) {
          return true;
        } // Once a base key is deleted, future changes go undetected, because its
        // descriptor is erased. This branch detects any missed changes.
        else {
            var value = draft[key];
            var state$1 = value && value[DRAFT_STATE];

            if (state$1 ? state$1.base !== baseValue : !is(value, baseValue)) {
              return true;
            }
          }
      } // At this point, no keys were added or changed.
      // Compare key count to determine if keys were deleted.


      return keys.length !== Object.keys(base).length;
    }

    function hasArrayChanges(state) {
      var draft = state.draft;
      if (draft.length !== state.base.length) { return true; } // See #116
      // If we first shorten the length, our array interceptors will be removed.
      // If after that new items are added, result in the same original length,
      // those last items will have no intercepting property.
      // So if there is no own descriptor on the last position, we know that items were removed and added
      // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
      // the last one

      var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

      if (descriptor && !descriptor.get) { return true; } // For all other cases, we don't have to compare, as they would have been picked up by the index setters

      return false;
    }

    function createHiddenProperty(target, prop, value) {
      Object.defineProperty(target, prop, {
        value: value,
        enumerable: false,
        writable: true
      });
    }

    var legacyProxy = /*#__PURE__*/Object.freeze({
    	willFinalize: willFinalize,
    	createProxy: createProxy
    });

    function willFinalize$1() {}
    function createProxy$1(base, parent) {
      var scope = parent ? parent.scope : ImmerScope.current;
      var state = {
        // Track which produce call this is associated with.
        scope: scope,
        // True for both shallow and deep changes.
        modified: false,
        // Used during finalization.
        finalized: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned: {},
        // The parent draft state.
        parent: parent,
        // The base state.
        base: base,
        // The base proxy.
        draft: null,
        // Any property proxies.
        drafts: {},
        // The base copy with any updated values.
        copy: null,
        // Called by the `produce` function.
        revoke: null
      };
      var ref = Array.isArray(base) ? // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
      // although state itself is an object
      Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
      var revoke = ref.revoke;
      var proxy = ref.proxy;
      state.draft = proxy;
      state.revoke = revoke;
      scope.drafts.push(proxy);
      return proxy;
    }
    var objectTraps = {
      get: get$1,

      has: function has(target, prop) {
        return prop in source$1(target);
      },

      ownKeys: function ownKeys(target) {
        return Reflect.ownKeys(source$1(target));
      },

      set: set$1,
      deleteProperty: deleteProperty,
      getOwnPropertyDescriptor: getOwnPropertyDescriptor,

      defineProperty: function defineProperty() {
        throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
      },

      getPrototypeOf: function getPrototypeOf(target) {
        return Object.getPrototypeOf(target.base);
      },

      setPrototypeOf: function setPrototypeOf() {
        throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
      }

    };
    var arrayTraps = {};
    each(objectTraps, function (key, fn) {
      arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
      };
    });

    arrayTraps.deleteProperty = function (state, prop) {
      if (isNaN(parseInt(prop))) {
        throw new Error("Immer only supports deleting array indices"); // prettier-ignore
      }

      return objectTraps.deleteProperty.call(this, state[0], prop);
    };

    arrayTraps.set = function (state, prop, value) {
      if (prop !== "length" && isNaN(parseInt(prop))) {
        throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
      }

      return objectTraps.set.call(this, state[0], prop, value);
    }; // returns the object we should be reading the current value from, which is base, until some change has been made


    function source$1(state) {
      return state.copy || state.base;
    } // Access a property without creating an Immer draft.


    function peek$1(draft, prop) {
      var state = draft[DRAFT_STATE];
      var desc = Reflect.getOwnPropertyDescriptor(state ? source$1(state) : draft, prop);
      return desc && desc.value;
    }

    function get$1(state, prop) {
      if (prop === DRAFT_STATE) { return state; }
      var drafts = state.drafts; // Check for existing draft in unmodified state.

      if (!state.modified && has(drafts, prop)) {
        return drafts[prop];
      }

      var value = source$1(state)[prop];

      if (state.finalized || !isDraftable(value)) {
        return value;
      } // Check for existing draft in modified state.


      if (state.modified) {
        // Assigned values are never drafted. This catches any drafts we created, too.
        if (value !== peek$1(state.base, prop)) { return value; } // Store drafts on the copy (when one exists).

        drafts = state.copy;
      }

      return drafts[prop] = createProxy$1(value, state);
    }

    function set$1(state, prop, value) {
      if (!state.modified) {
        var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
        // never be undefined, so we can avoid the `in` operator. Lastly, truthy
        // values may be drafts, but falsy values are never drafts.

        var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;
        if (isUnchanged) { return true; }
        markChanged$1(state);
      }

      state.assigned[prop] = true;
      state.copy[prop] = value;
      return true;
    }

    function deleteProperty(state, prop) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (peek$1(state.base, prop) !== undefined || prop in state.base) {
        state.assigned[prop] = false;
        markChanged$1(state);
      } else if (state.assigned[prop]) {
        // if an originally not assigned property was deleted
        delete state.assigned[prop];
      }

      if (state.copy) { delete state.copy[prop]; }
      return true;
    } // Note: We never coerce `desc.value` into an Immer draft, because we can't make
    // the same guarantee in ES5 mode.


    function getOwnPropertyDescriptor(state, prop) {
      var owner = source$1(state);
      var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

      if (desc) {
        desc.writable = true;
        desc.configurable = !Array.isArray(owner) || prop !== "length";
      }

      return desc;
    }

    function markChanged$1(state) {
      if (!state.modified) {
        state.modified = true;
        state.copy = assign(shallowCopy(state.base), state.drafts);
        state.drafts = null;
        if (state.parent) { markChanged$1(state.parent); }
      }
    }

    var modernProxy = /*#__PURE__*/Object.freeze({
    	willFinalize: willFinalize$1,
    	createProxy: createProxy$1
    });

    function generatePatches(state, basePath, patches, inversePatches) {
      Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
    }

    function generateArrayPatches(state, basePath, patches, inversePatches) {
      var assign, assign$1;

      var base = state.base;
      var copy = state.copy;
      var assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

      if (copy.length < base.length) {
        (assign = [copy, base], base = assign[0], copy = assign[1]);
        (assign$1 = [inversePatches, patches], patches = assign$1[0], inversePatches = assign$1[1]);
      }

      var delta = copy.length - base.length; // Find the first replaced index.

      var start = 0;

      while (base[start] === copy[start] && start < base.length) {
        ++start;
      } // Find the last replaced index. Search from the end to optimize splice patches.


      var end = base.length;

      while (end > start && base[end - 1] === copy[end + delta - 1]) {
        --end;
      } // Process replaced indices.


      for (var i = start; i < end; ++i) {
        if (assigned[i] && copy[i] !== base[i]) {
          var path = basePath.concat([i]);
          patches.push({
            op: "replace",
            path: path,
            value: copy[i]
          });
          inversePatches.push({
            op: "replace",
            path: path,
            value: base[i]
          });
        }
      }

      var replaceCount = patches.length; // Process added indices.

      for (var i$1 = end + delta - 1; i$1 >= end; --i$1) {
        var path$1 = basePath.concat([i$1]);
        patches[replaceCount + i$1 - end] = {
          op: "add",
          path: path$1,
          value: copy[i$1]
        };
        inversePatches.push({
          op: "remove",
          path: path$1
        });
      }
    }

    function generateObjectPatches(state, basePath, patches, inversePatches) {
      var base = state.base;
      var copy = state.copy;
      each(state.assigned, function (key, assignedValue) {
        var origValue = base[key];
        var value = copy[key];
        var op = !assignedValue ? "remove" : key in base ? "replace" : "add";
        if (origValue === value && op === "replace") { return; }
        var path = basePath.concat(key);
        patches.push(op === "remove" ? {
          op: op,
          path: path
        } : {
          op: op,
          path: path,
          value: value
        });
        inversePatches.push(op === "add" ? {
          op: "remove",
          path: path
        } : op === "remove" ? {
          op: "add",
          path: path,
          value: origValue
        } : {
          op: "replace",
          path: path,
          value: origValue
        });
      });
    }

    var applyPatches = function (draft, patches) {
      for (var i$1 = 0, list = patches; i$1 < list.length; i$1 += 1) {
        var patch = list[i$1];

        var path = patch.path;
        var op = patch.op;
        var value = clone(patch.value); // used to clone patch to ensure original patch is not modified, see #411

        if (!path.length) { throw new Error("Illegal state"); }
        var base = draft;

        for (var i = 0; i < path.length - 1; i++) {
          base = base[path[i]];
          if (!base || typeof base !== "object") { throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); } // prettier-ignore
        }

        var key = path[path.length - 1];

        switch (op) {
          case "replace":
            // if value is an object, then it's assigned by reference
            // in the following add or remove ops, the value field inside the patch will also be modifyed
            // so we use value from the cloned patch
            base[key] = value;
            break;

          case "add":
            if (Array.isArray(base)) {
              // TODO: support "foo/-" paths for appending to an array
              base.splice(key, 0, value);
            } else {
              base[key] = value;
            }

            break;

          case "remove":
            if (Array.isArray(base)) {
              base.splice(key, 1);
            } else {
              delete base[key];
            }

            break;

          default:
            throw new Error("Unsupported patch operation: " + op);
        }
      }

      return draft;
    };

    function verifyMinified() {}

    var configDefaults = {
      useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
      autoFreeze: typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : verifyMinified.name === "verifyMinified",
      onAssign: null,
      onDelete: null,
      onCopy: null
    };
    var Immer = function Immer(config) {
      assign(this, configDefaults, config);
      this.setUseProxies(this.useProxies);
      this.produce = this.produce.bind(this);
    };

    Immer.prototype.produce = function produce (base, recipe, patchListener) {
        var this$1 = this;

      // curried invocation
      if (typeof base === "function" && typeof recipe !== "function") {
        var defaultBase = recipe;
        recipe = base;
        var self = this;
        return function curriedProduce(base) {
            var this$1 = this;
            if ( base === void 0 ) base = defaultBase;
            var args = [], len = arguments.length - 1;
            while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          return self.produce(base, function (draft) { return recipe.call.apply(recipe, [ this$1, draft ].concat( args )); }); // prettier-ignore
        };
      } // prettier-ignore


      {
        if (typeof recipe !== "function") {
          throw new Error("The first or second argument to `produce` must be a function");
        }

        if (patchListener !== undefined && typeof patchListener !== "function") {
          throw new Error("The third argument to `produce` must be a function or undefined");
        }
      }
      var result; // Only plain objects, arrays, and "immerable classes" are drafted.

      if (isDraftable(base)) {
        var scope = ImmerScope.enter();
        var proxy = this.createProxy(base);
        var hasError = true;

        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          // finally instead of catch + rethrow better preserves original stack
          if (hasError) { scope.revoke(); }else { scope.leave(); }
        }

        if (result instanceof Promise) {
          return result.then(function (result) {
            scope.usePatches(patchListener);
            return this$1.processResult(result, scope);
          }, function (error) {
            scope.revoke();
            throw error;
          });
        }

        scope.usePatches(patchListener);
        return this.processResult(result, scope);
      } else {
        result = recipe(base);
        if (result === undefined) { return base; }
        return result !== NOTHING ? result : undefined;
      }
    };

    Immer.prototype.produceWithPatches = function produceWithPatches (arg1, arg2, arg3) {
        var this$1 = this;

      if (typeof arg1 === "function") {
        return function (state) {
            var args = [], len = arguments.length - 1;
            while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

            return this$1.produceWithPatches(state, function (draft) { return arg1.apply(void 0, [ draft ].concat( args )); });
          };
      } // non-curried form


      if (arg3) { throw new Error("A patch listener cannot be passed to produceWithPatches"); }
      var patches, inversePatches;
      var nextState = this.produce(arg1, arg2, function (p, ip) {
        patches = p;
        inversePatches = ip;
      });
      return [nextState, patches, inversePatches];
    };

    Immer.prototype.createDraft = function createDraft (base) {
      if (!isDraftable(base)) {
        throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
      }

      var scope = ImmerScope.enter();
      var proxy = this.createProxy(base);
      proxy[DRAFT_STATE].isManual = true;
      scope.leave();
      return proxy;
    };

    Immer.prototype.finishDraft = function finishDraft (draft, patchListener) {
      var state = draft && draft[DRAFT_STATE];

      if (!state || !state.isManual) {
        throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
      }

      if (state.finalized) {
        throw new Error("The given draft is already finalized"); // prettier-ignore
      }

      var scope = state.scope;
      scope.usePatches(patchListener);
      return this.processResult(undefined, scope);
    };

    Immer.prototype.setAutoFreeze = function setAutoFreeze (value) {
      this.autoFreeze = value;
    };

    Immer.prototype.setUseProxies = function setUseProxies (value) {
      this.useProxies = value;
      assign(this, value ? modernProxy : legacyProxy);
    };

    Immer.prototype.applyPatches = function applyPatches$1 (base, patches) {
      // If a patch replaces the entire state, take that replacement as base
      // before applying patches
      var i;

      for (i = patches.length - 1; i >= 0; i--) {
        var patch = patches[i];

        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }

      if (isDraft(base)) {
        // N.B: never hits if some patch a replacement, patches are never drafts
        return applyPatches(base, patches);
      } // Otherwise, produce a copy of the base state.


      return this.produce(base, function (draft) { return applyPatches(draft, patches.slice(i + 1)); });
    };
    /** @internal */


    Immer.prototype.processResult = function processResult (result, scope) {
      var baseDraft = scope.drafts[0];
      var isReplaced = result !== undefined && result !== baseDraft;
      this.willFinalize(scope, result, isReplaced);

      if (isReplaced) {
        if (baseDraft[DRAFT_STATE].modified) {
          scope.revoke();
          throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
        }

        if (isDraftable(result)) {
          // Finalize the result in case it contains (or is) a subset of the draft.
          result = this.finalize(result, null, scope);
        }

        if (scope.patches) {
          scope.patches.push({
            op: "replace",
            path: [],
            value: result
          });
          scope.inversePatches.push({
            op: "replace",
            path: [],
            value: baseDraft[DRAFT_STATE].base
          });
        }
      } else {
        // Finalize the base draft.
        result = this.finalize(baseDraft, [], scope);
      }

      scope.revoke();

      if (scope.patches) {
        scope.patchListener(scope.patches, scope.inversePatches);
      }

      return result !== NOTHING ? result : undefined;
    };
    /**
     * @internal
     * Finalize a draft, returning either the unmodified base state or a modified
     * copy of the base state.
     */


    Immer.prototype.finalize = function finalize (draft, path, scope) {
        var this$1 = this;

      var state = draft[DRAFT_STATE];

      if (!state) {
        if (Object.isFrozen(draft)) { return draft; }
        return this.finalizeTree(draft, null, scope);
      } // Never finalize drafts owned by another scope.


      if (state.scope !== scope) {
        return draft;
      }

      if (!state.modified) {
        return state.base;
      }

      if (!state.finalized) {
        state.finalized = true;
        this.finalizeTree(state.draft, path, scope);

        if (this.onDelete) {
          // The `assigned` object is unreliable with ES5 drafts.
          if (this.useProxies) {
            var assigned = state.assigned;

            for (var prop in assigned) {
              if (!assigned[prop]) { this.onDelete(state, prop); }
            }
          } else {
            var base = state.base;
              var copy = state.copy;
            each(base, function (prop) {
              if (!has(copy, prop)) { this$1.onDelete(state, prop); }
            });
          }
        }

        if (this.onCopy) {
          this.onCopy(state);
        } // At this point, all descendants of `state.copy` have been finalized,
        // so we can be sure that `scope.canAutoFreeze` is accurate.


        if (this.autoFreeze && scope.canAutoFreeze) {
          Object.freeze(state.copy);
        }

        if (path && scope.patches) {
          generatePatches(state, path, scope.patches, scope.inversePatches);
        }
      }

      return state.copy;
    };
    /**
     * @internal
     * Finalize all drafts in the given state tree.
     */


    Immer.prototype.finalizeTree = function finalizeTree (root, rootPath, scope) {
        var this$1 = this;

      var state = root[DRAFT_STATE];

      if (state) {
        if (!this.useProxies) {
          // Create the final copy, with added keys and without deleted keys.
          state.copy = shallowCopy(state.draft, true);
        }

        root = state.copy;
      }

      var needPatches = !!rootPath && !!scope.patches;

      var finalizeProperty = function (prop, value, parent) {
        if (value === parent) {
          throw Error("Immer forbids circular references");
        } // In the `finalizeTree` method, only the `root` object may be a draft.


        var isDraftProp = !!state && parent === root;

        if (isDraft(value)) {
          var path = isDraftProp && needPatches && !state.assigned[prop] ? rootPath.concat(prop) : null; // Drafts owned by `scope` are finalized here.

          value = this$1.finalize(value, path, scope); // Drafts from another scope must prevent auto-freezing.

          if (isDraft(value)) {
            scope.canAutoFreeze = false;
          } // Preserve non-enumerable properties.


          if (Array.isArray(parent) || isEnumerable(parent, prop)) {
            parent[prop] = value;
          } else {
            Object.defineProperty(parent, prop, {
              value: value
            });
          } // Unchanged drafts are never passed to the `onAssign` hook.


          if (isDraftProp && value === state.base[prop]) { return; }
        } // Unchanged draft properties are ignored.
        else if (isDraftProp && is(value, state.base[prop])) {
            return;
          } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
          else if (isDraftable(value) && !Object.isFrozen(value)) {
              each(value, finalizeProperty);
            }

        if (isDraftProp && this$1.onAssign) {
          this$1.onAssign(state, prop, value);
        }
      };

      each(root, finalizeProperty);
      return root;
    };

    var immer = new Immer();
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */

    var produce = immer.produce;
    /**
     * Like `produce`, but `produceWithPatches` always returns a tuple
     * [nextState, patches, inversePatches] (instead of just the next state)
     */

    var produceWithPatches = immer.produceWithPatches.bind(immer);
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is disabled in production.
     */

    var setAutoFreeze = immer.setAutoFreeze.bind(immer);
    /**
     * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
     * always faster than using ES5 proxies.
     *
     * By default, feature detection is used, so calling this is rarely necessary.
     */

    var setUseProxies = immer.setUseProxies.bind(immer);
    /**
     * Apply an array of Immer patches to the first argument.
     *
     * This function is a producer, which means copy-on-write is in effect.
     */

    var applyPatches$1 = immer.applyPatches.bind(immer);
    /**
     * Create an Immer draft from the given base state, which may be a draft itself.
     * The draft can be modified until you finalize it with the `finishDraft` function.
     */

    var createDraft = immer.createDraft.bind(immer);
    /**
     * Finalize an Immer draft from a `createDraft` call, returning the base state
     * (if no changes were made) or a modified copy. The draft must *not* be
     * mutated afterwards.
     *
     * Pass a function as the 2nd argument to generate Immer patches based on the
     * changes that were made.
     */

    var finishDraft = immer.finishDraft.bind(immer);

    var initialState = {
        frameStartTime: performance.now(),
        deltaTime: 0,
    };
    var clock = interval(1000 / FPS, animationFrameScheduler);
    var updateTime = produce(function (draft, previousTime) {
        draft.frameStartTime = performance.now();
        draft.deltaTime = draft.frameStartTime - previousTime.frameStartTime;
    });
    var clock$1 = clock.pipe(scan(function (previous) { return updateTime(initialState, previous); }, initialState));
    /*
      scan((previous) => {
            const time = performance.now();
            return previous.merge({
              time,
              delta: time - previous.get('time')
            });
          }, state)
        );

    const increment = produce((draft: Draft<State>, inc: number) => {
        // `x` can be modified here
        draft.x += inc
    })
    frameStartTime: Number;
      readonly deltaTime: Number;
     */

    var click$ = fromEvent(document, 'click');
    var keydown$ = fromEvent(document, 'keydown');
    var keyup$ = fromEvent(document, 'keyup');
    var keypressed$ = fromEvent(document, 'keypressed');
    var touch$ = combineLatest([
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'touchmove'),
        fromEvent(document, 'touchcancel'),
        fromEvent(document, 'touchend'),
    ]);

    exports.FPS = FPS;
    exports.click$ = click$;
    exports.clock$ = clock$1;
    exports.keydown$ = keydown$;
    exports.keypressed$ = keypressed$;
    exports.keyup$ = keyup$;
    exports.touch$ = touch$;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

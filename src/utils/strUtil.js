//字符串替换
/**
 * example:
 *   '{0} , {1}, {2}'.format(['he', 'll', 'o']);// he,ll,o
 * @returns {string}
 */
String.prototype.format = function () {
    if (arguments.length === 0) {
        return '';
    }
    let source = this.toString();
    let reg = /{(\d+)?}/g;
    let args = arguments[0];
    return source.replace(reg, function ($0, $1) {
        let arg = args[parseInt($1)];
        return !!arg?arg:args[0];
    });
};

//循环
Array.prototype.each = function () {
    if (arguments.length === 0) {
        throw new TypeError('argument must not be null');
    }
    if (typeof arguments[0] != 'function') {
        throw new TypeError('argument must be function');
    }
    let _t = this, callBack = arguments[0];
    for (let i = 0; i < _t.length; i++){
        callBack.call(_t, i, _t[i]);
    }
};

//替换数组中的字符串元素
Array.prototype.replace = function (idx) {
    if (!(idx instanceof Array)) {
        throw new TypeError('argument is must array');
    }
    let _t = this;
    for (let i = 0; i < _t.length; i++) {
        if (typeof _t[i] === 'string') {
            _t[i] = _t[i].format(idx);
        }
    }
};

exports.strUtil = {};

/*
 * THIS FILE IS AUTO GENERATED from 'lib/hamt.kep'
 * DO NOT EDIT
*/
define(["require", "exports"], (function(require, exports) {
    "use strict";
    var hash, empty, tryGetHash, tryGet, getHash, get, hasHash, has, setHash, set, modifyHash, modify,
            removeHash, remove, fold, count, pairs, keys, values, m1, m2, m4, size = 5,
        BUCKET_SIZE = Math.pow(2, size),
        mask = (BUCKET_SIZE - 1),
        maxIndexNode = (BUCKET_SIZE / 2),
        minArrayNode = (BUCKET_SIZE / 4),
        constant = (function(x) {
            return (function() {
                return x;
            });
        }),
        nothing = ({}),
        isNothing = (function(x, y) {
            return (x === y);
        })
            .bind(null, nothing),
        maybe = (function(val, def) {
            return (isNothing(val) ? def : val);
        }),
        popcount = ((m1 = 1431655765), (m2 = 858993459), (m4 = 252645135), (function(num) {
            var x = num;
            (x = (x - ((x >> 1) & m1)));
            (x = ((x & m2) + ((x >> 2) & m2)));
            (x = ((x + (x >> 4)) & m4));
            (x = (x + (x >> 8)));
            (x = (x + (x >> 16)));
            return (x & 127);
        })),
        hashFragment = (function(shift, h) {
            return ((h >>> shift) & mask);
        }),
        toBitmap = (function(frag) {
            return (1 << frag);
        }),
        fromBitmap = (function(bitmap, bit) {
            return popcount((bitmap & (toBitmap(bit) - 1)));
        }),
        arrayUpdate = (function(at, v, arr) {
            var out = arr.slice();
            (out[at] = v);
            return out;
        }),
        arraySpliceOut = (function(at, arr) {
            var out = arr.slice();
            out.splice(at, 1);
            return out;
        }),
        arraySpliceIn = (function(at, v, arr) {
            var out = arr.slice();
            out.splice(at, 0, v);
            return out;
        });
    (hash = (function(str) {
        if (((typeof str) === "number")) return str;
        var hash = 0;
        for (var i = 0, len = str.length;
            (i < len);
            (i = (i + 1))) {
            var c = str.charCodeAt(i);
            (hash = ((((hash << 5) - hash) + c) | 0));
        }
        return hash;
    }));
    (empty = ({}));
    var Leaf = (function(hash, key, value) {
        var self = this;
        (self.hash = hash);
        (self.key = key);
        (self.value = value);
    }),
        Collision = (function(hash, list) {
            var self = this;
            (self.hash = hash);
            (self.list = list);
        }),
        IndexedNode = (function(mask, children) {
            var self = this;
            (self.mask = mask);
            (self.children = children);
        }),
        ArrayNode = (function(count, children) {
            var self = this;
            (self.count = count);
            (self.children = children);
        }),
        isEmpty = (function(x, y) {
            return (x === y);
        })
            .bind(null, empty),
        isLeaf = (function(node) {
            return (((node === empty) || (node instanceof Leaf)) || (node instanceof Collision));
        }),
        expand = (function(frag, child, bitmap, subNodes) {
            var bit = bitmap,
                arr = [],
                count = 0;
            for (var i = 0;
                (i < BUCKET_SIZE);
                (i = (i + 1))) {
                if ((bit & 1)) {
                    (arr[i] = subNodes[count]);
                    (count = (count + 1));
                } else {
                    (arr[i] = empty);
                }
                (bit = (bit >>> 1));
            }
            (arr[frag] = child);
            return new(ArrayNode)((count + 1), arr);
        }),
        pack = (function(removed, elements) {
            var children = [],
                bitmap = 0;
            for (var i = 0, len = elements.length;
                (i < len);
                (i = (i + 1))) {
                var elem = elements[i];
                if (((i !== removed) && (!isEmpty(elem)))) {
                    children.push(elem);
                    (bitmap = (bitmap | (1 << i)));
                }
            }
            return new(IndexedNode)(bitmap, children);
        }),
        mergeLeaves = (function(shift, n1, n2) {
            var h1, h2, subH1, subH2;
            return (isEmpty(n2) ? n1 : ((h1 = n1.hash), (h2 = n2.hash), ((h1 === h2) ? new(Collision)(h1, [
                n2, n1
            ]) : ((subH1 = hashFragment(shift, h1)), (subH2 = hashFragment(shift, h2)), new(
                IndexedNode)((toBitmap(subH1) | toBitmap(subH2)), ((subH1 === subH2) ? [
                mergeLeaves((shift + size), n1, n2)
            ] : ((subH1 < subH2) ? [n1, n2] : [n2, n1])))))));
        }),
        updateCollisionList = (function(list, f, k) {
            var first, rest, v;
            return ((!list.length) ? [] : ((first = list[0]), (rest = list.slice(1)), ((first.key === k) ?
                ((v = f(first.value)), (isNothing(v) ? rest : [v].concat(rest))) : [first].concat(
                    updateCollisionList(rest, f, k)))));
        });
    (empty.lookup = (function(_, _0, _1) {
        return nothing;
    }));
    (Leaf.prototype.lookup = (function(_, _0, k) {
        var self = this;
        return ((k === self.key) ? self.value : nothing);
    }));
    (Collision.prototype.lookup = (function(_, _0, k) {
        var self = this;
        for (var i = 0, len = self.list.length;
            (i < len);
            (i = (i + 1))) {
            var __o = self.list[i],
                key = __o["key"],
                value = __o["value"];
            if ((k === key)) return value;
        }
        return nothing;
    }));
    (IndexedNode.prototype.lookup = (function(shift, h, k) {
        var self = this,
            frag = hashFragment(shift, h);
        return ((self.mask & toBitmap(frag)) ? self.children[fromBitmap(self.mask, frag)].lookup((shift +
            size), h, k) : nothing);
    }));
    (ArrayNode.prototype.lookup = (function(shift, h, k) {
        var self = this,
            frag = hashFragment(shift, h),
            child = self.children[frag];
        return child.lookup((shift + size), h, k);
    }));
    (empty.modify = (function(_, f, h, k) {
        var v = f();
        return (isNothing(v) ? empty : new(Leaf)(h, k, v));
    }));
    (Leaf.prototype.modify = (function(shift, f, h, k) {
        var v, self = this;
        return ((k === self.key) ? ((v = f(self.value)), (isNothing(v) ? empty : new(Leaf)(h, k, v))) :
            mergeLeaves(shift, self, empty.modify(shift, f, h, k)));
    }));
    (Collision.prototype.modify = (function(shift, f, h, k) {
        var self = this,
            list = updateCollisionList(self.list, f, k);
        return ((list.length > 1) ? new(Collision)(self.hash, list) : list[0]);
    }));
    (IndexedNode.prototype.modify = (function(shift, f, h, k) {
        var self = this,
            frag = hashFragment(shift, h),
            bit = toBitmap(frag),
            indx = fromBitmap(self.mask, frag),
            exists = (self.mask & bit),
            child = (exists ? self.children[indx] : empty)
                .modify((shift + size), f, h, k),
            removed = (exists && isEmpty(child)),
            added = ((!exists) && (!isEmpty(child))),
            bound = (removed ? (self.children.length - 1) : (added ? (self.children.length + 1) : self.children
                .length)),
            subNodes = (removed ? arraySpliceOut(indx, self.children) : (added ? arraySpliceIn(indx,
                child, self.children) : arrayUpdate(indx, child, self.children))),
            bitmap = (removed ? (self.mask & (~bit)) : (added ? (self.mask | bit) : self.mask));
        return ((!bitmap) ? empty : (((bound <= 0) && isLeaf(self.children[0])) ? self.children[0] : ((
            bound >= maxIndexNode) ? expand(frag, child, bitmap, subNodes) : new(
            IndexedNode)(bitmap, subNodes))));
    }));
    (ArrayNode.prototype.modify = (function(shift, f, h, k) {
        var self = this,
            frag = hashFragment(shift, h),
            child = self.children[frag],
            newChild = child.modify((shift + size), f, h, k);
        return ((isEmpty(child) && (!isEmpty(newChild))) ? new(ArrayNode)((self.count + 1), arrayUpdate(
            frag, newChild, self.children)) : (((!isEmpty(child)) && isEmpty(newChild)) ? (((self.count -
            1) <= minArrayNode) ? pack(frag, self.children) : new(ArrayNode)((self.count -
            1), arrayUpdate(frag, empty, self.children))) : new(ArrayNode)(self.count,
            arrayUpdate(frag, newChild, self.children))));
    }));
    (tryGetHash = (function(alt, h, k, m) {
        return maybe(m.lookup(0, h, k), alt);
    }));
    (tryGet = (function(alt, k, m) {
        return tryGetHash(alt, hash(k), k, m);
    }));
    (getHash = tryGetHash.bind(null, null));
    (get = tryGet.bind(null, null));
    (hasHash = (function(h, k, m) {
        return (!isNothing(m.lookup(0, h, k)));
    }));
    (has = (function(k, m) {
        return hasHash(hash(k), k, m);
    }));
    (modifyHash = (function(h, k, f, m) {
        return m.modify(0, f, h, k);
    }));
    (modify = (function(k, f, m) {
        return modifyHash(hash(k), k, f, m);
    }));
    (setHash = (function(h, k, v, m) {
        return modifyHash(h, k, constant(v), m);
    }));
    (set = (function(k, v, m) {
        return setHash(hash(k), k, v, m);
    }));
    var del = constant(nothing);
    (removeHash = (function(h, k, m) {
        return modifyHash(h, k, del, m);
    }));
    (remove = (function(k, m) {
        return removeHash(hash(k), k, m);
    }));
    (empty.fold = (function(_, z) {
        return z;
    }));
    (Leaf.prototype.fold = (function(f, z) {
        var self = this;
        return f(z, self);
    }));
    (Collision.prototype.fold = (function(f, z) {
        var self = this;
        return self.list.reduce(f, z);
    }));
    (IndexedNode.prototype.fold = (function(f, z) {
        var self = this;
        return self.children.reduce(fold.bind(null, f), z);
    }));
    (ArrayNode.prototype.fold = (function(f, z) {
        var self = this;
        return self.children.reduce(fold.bind(null, f), z);
    }));
    (fold = (function(f, z, m) {
        return m.fold(f, z);
    }));
    (count = fold.bind(null, (function(x, y) {
            return (x + y);
        })
        .bind(null, 1), 0));
    var build = (function(p, __o) {
        var key = __o["key"],
            value = __o["value"];
        p.push([key, value]);
        return p;
    });
    (pairs = (function(m) {
        return fold(build, [], m);
    }));
    var build0 = (function(p, __o) {
        var key = __o["key"];
        p.push(key);
        return p;
    });
    (keys = (function(m) {
        return fold(build0, [], m);
    }));
    var build1 = (function(p, __o) {
        var value = __o["value"];
        p.push(value);
        return p;
    });
    (values = (function(m) {
        return fold(build1, [], m);
    }));
    (exports.hash = hash);
    (exports.empty = empty);
    (exports.tryGetHash = tryGetHash);
    (exports.tryGet = tryGet);
    (exports.getHash = getHash);
    (exports.get = get);
    (exports.hasHash = hasHash);
    (exports.has = has);
    (exports.setHash = setHash);
    (exports.set = set);
    (exports.modifyHash = modifyHash);
    (exports.modify = modify);
    (exports.removeHash = removeHash);
    (exports.remove = remove);
    (exports.fold = fold);
    (exports.count = count);
    (exports.pairs = pairs);
    (exports.keys = keys);
    (exports.values = values);
}));
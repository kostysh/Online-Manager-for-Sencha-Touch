/**
 * This is the destination modifier that has to be put at
 * the top of the modifier stack.
 *
 * Performance critical
 */
Ext.define("Ext.draw.modifier.Target", {
    extend: "Ext.draw.modifier.Modifier",
    alias: 'modifier.target',

    config: {
        sprite: null
    },

    prepareAttributes: function (attr) {
        if (this._previous) {
            this._previous.prepareAttributes(attr);
        }

        if (!attr.hasOwnProperty('canvasAttributes')) {
            attr.bbox = {
                plain: 0,
                transform: 0
            };
            attr.dirty = true;
            attr.dirtyFlags = {};
            attr.canvasAttributes = {};
            attr.matrix = new Ext.draw.Matrix();
            attr.inverseMatrix = new Ext.draw.Matrix();
        }
    },

    setDirtyFlags: function (attr, changes) {
        Ext.apply(attr, changes);
        var sprite = this._sprite,
            dirtyTriggers = sprite.self.def._dirtyTriggers,
            name, dirtyFlags = attr.dirtyFlags, flags,
            triggers, trigger, i, ln, canvasNames;

        for (name in changes) {
            if ((triggers = dirtyTriggers[name])) {
                i = 0;
                while ((trigger = triggers[i++])) {
                    if (!(flags = dirtyFlags[trigger])) {
                        flags = dirtyFlags[trigger] = [];
                    }
                    flags.push(name);
                }
            }
        }

        // This can prevent sub objects to set duplicated attributes to
        // context.
        if (dirtyFlags.canvas) {
            canvasNames = dirtyFlags.canvas;
            delete dirtyFlags.canvas;
            for (i = 0, ln = canvasNames.length; i < ln; i++) {
                name = canvasNames[i];
                attr.canvasAttributes[name] = attr[name];
            }
        }
        sprite.setDirty(true);
    },

    popUp: function (attributes, changes) {
        this.setDirtyFlags(attributes, changes);
        this._sprite.updateDirtyFlags(attributes);
    },

    pushDown: function (attr, changes) {
        if (this._previous) {
            changes = this._previous.pushDown(attr, changes);
        }
        this.setDirtyFlags(attr, changes);
        return changes;
    }
});
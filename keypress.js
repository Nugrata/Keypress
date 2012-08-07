// Generated by CoffeeScript 1.3.3

/*
License agreements:
1) Feel free to modify the code.
2) Feel free to credit the author.
3) Keep being awesome.

Keypress
A keyboard input capturing utility in which any key can be a modifier key.
Requires jQuery
Author: David Mauro
*/


(function() {
  var _bug_catcher, _combine_arrays, _combo_defaults, _compare_arrays, _convert_key_to_readable, _decide_meta_key, _dont_fire_on_keyup, _event_classname, _key_down, _key_up, _keys_down, _match_combos, _metakey, _prevent_capture, _prevent_default, _prevented_previous_keypress, _receive_input, _registered_combos, _remove_val_from_array, _valid_combos, _validate_combo,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _registered_combos = [];

  _keys_down = [];

  _valid_combos = [];

  _prevent_capture = false;

  _prevented_previous_keypress = false;

  _event_classname = "keypress_events";

  _metakey = "ctrl";

  _dont_fire_on_keyup = false;

  _combo_defaults = {
    keys: [],
    count: 0,
    fire_on_keyup: false,
    is_ordered: false,
    is_repeating: false,
    on_repeat: null,
    on_fire: function() {}
  };

  _remove_val_from_array = function(array, value) {
    var t, _ref;
    if (!(array && (value != null))) {
      return false;
    }
    if ((t = array.indexOf(value)) > -1) {
      [].splice.apply(array, [t, t - t + 1].concat(_ref = [])), _ref;
    }
    return array;
  };

  _combine_arrays = function() {
    var a, array, value, _i, _j, _len, _len1;
    array = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      a = arguments[_i];
      for (_j = 0, _len1 = a.length; _j < _len1; _j++) {
        value = a[_j];
        array.push(value);
      }
    }
    return array;
  };

  _compare_arrays = function(a1, a2) {
    /*
        This will ignore the ordering of the arrays
        and simply check if they have the same contents.
    
        This isn't perfect as for example these two 
        arrays would evaluate as being the same:
        ["apple", "orange", "orange"], ["orange", "apple", "apple"]
        But it will serve for now.
    */

    var item, _i, _j, _len, _len1;
    if (a1.length !== a2.length) {
      return false;
    }
    for (_i = 0, _len = a1.length; _i < _len; _i++) {
      item = a1[_i];
      if (__indexOf.call(a2, item) >= 0) {
        continue;
      }
      return false;
    }
    for (_j = 0, _len1 = a2.length; _j < _len1; _j++) {
      item = a2[_j];
      if (__indexOf.call(a1, item) >= 0) {
        continue;
      }
      return false;
    }
    return true;
  };

  _match_combos = function(potential_match, source, allow_partial_match) {
    var source_combo, _i, _len;
    if (potential_match == null) {
      potential_match = _keys_down;
    }
    if (source == null) {
      source = _registered_combos;
    }
    if (allow_partial_match == null) {
      allow_partial_match = false;
    }
    /*
        This checks each of a set of combos to determine if the
        potential_match array is either a perfect match to any of
        them or if it is a partial match to the start of a combo.
    */

    for (_i = 0, _len = source.length; _i < _len; _i++) {
      source_combo = source[_i];
      if (source_combo.is_ordered) {
        if (potential_match.join("") === source_combo.keys.join("")) {
          return source_combo;
        }
        if (allow_partial_match && potential_match.join("") === source_combo.keys.slice(0, potential_match.length).join("")) {
          return source_combo;
        }
      } else {
        if (_compare_arrays(potential_match, source_combo.keys)) {
          return source_combo;
        }
        if (allow_partial_match && _compare_arrays(potential_match, source_combo.keys.slice(0, potential_match.length))) {
          return source_combo;
        }
      }
    }
    return false;
  };

  _prevent_default = function(e) {
    /*
        This only happens if we have pressed a registered
        key combo, or if we're working towards one.
    */
    _prevented_previous_keypress = true;
    return e.preventDefault();
  };

  _key_down = function(key, e) {
    var combo, compare_keys, i, key_down, match, perfect_match, potential_combo, potential_match, prev_keys, replaced, should_make_new, valid_combo, _i, _j, _k, _l, _len, _len1, _len2, _match, _ref;
    should_make_new = true;
    for (_i = 0, _len = _keys_down.length; _i < _len; _i++) {
      key_down = _keys_down[_i];
      if (key_down === key) {
        should_make_new = false;
      }
    }
    if (!should_make_new) {
      if (_prevented_previous_keypress) {
        _prevent_default(e);
      }
      return;
    }
    _dont_fire_on_keyup = false;
    _prevented_previous_keypress = false;
    _keys_down.push(key);
    perfect_match = _match_combos();
    if (perfect_match && !perfect_match.fire_on_keyup && !perfect_match.is_repeating) {
      perfect_match.on_fire();
      perfect_match.is_activated = true;
      _dont_fire_on_keyup = true;
    }
    match = _match_combos(_keys_down, _valid_combos);
    if (!match) {
      _match = null;
      for (i = _j = 1, _ref = _keys_down.length; 1 <= _ref ? _j <= _ref : _j >= _ref; i = 1 <= _ref ? ++_j : --_j) {
        potential_match = _keys_down.slice(-i);
        _match = _match_combos(potential_match) || _match;
      }
      for (_k = 0, _len1 = _valid_combos.length; _k < _len1; _k++) {
        valid_combo = _valid_combos[_k];
        if (valid_combo.is_activated) {
          continue;
        }
        potential_combo = _combine_arrays(valid_combo.keys, [key]);
        _match = _match_combos(potential_combo) || _match;
      }
      if (_match) {
        match = $.extend(true, {}, _match);
        _valid_combos.push(match);
        _prevent_default(e);
      } else {
        for (_l = 0, _len2 = _registered_combos.length; _l < _len2; _l++) {
          combo = _registered_combos[_l];
          compare_keys = combo.keys.slice(0, _keys_down.length);
          if (_compare_arrays(_keys_down, compare_keys)) {
            _prevent_default(e);
          }
        }
      }
    } else {
      match.is_activated = false;
      _prevent_default(e);
    }
    console.log("Valid combos", _valid_combos);
    if (!match) {
      return;
    }
    if (match.is_repeating) {
      match.count += 1;
      match.on_repeat(match.count);
    } else {
      if (typeof match.on_repeat === "function") {
        match.on_repeat();
      }
    }
    if (!(match.keys.length > 1)) {
      return;
    }
    prev_keys = _remove_val_from_array($.extend(true, [], match.keys), key);
    replaced = _match_combos(prev_keys, _valid_combos, true);
    if (replaced === match) {
      return;
    }
    if (!replaced) {
      return;
    }
    _remove_val_from_array(_valid_combos, replaced);
  };

  _key_up = function(key) {
    var keys_remain, matched_combo, valid_combo, _i, _j, _len, _len1, _ref;
    if (__indexOf.call(_keys_down, key) < 0) {
      return;
    }
    _keys_down = _remove_val_from_array(_keys_down, key);
    for (_i = 0, _len = _valid_combos.length; _i < _len; _i++) {
      valid_combo = _valid_combos[_i];
      console.log("valid combo keys", valid_combo.keys);
      if (__indexOf.call(valid_combo.keys, key) >= 0) {
        matched_combo = valid_combo;
        break;
      }
    }
    if (!matched_combo) {
      return;
    }
    keys_remain = false;
    _ref = matched_combo.keys;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      key = _ref[_j];
      if (__indexOf.call(_keys_down, key) >= 0) {
        keys_remain = true;
        break;
      }
    }
    console.log("about to check:", matched_combo.is_activated, !matched_combo.fire_on_keyup, _dont_fire_on_keyup);
    if (!(matched_combo.is_activated || !matched_combo.fire_on_keyup || _dont_fire_on_keyup)) {
      console.log("gonna fire");
      if (matched_combo.is_repeating) {
        if (!keys_remain) {
          matched_combo.on_fire();
        }
      } else {
        matched_combo.on_fire();
        matched_combo.is_activated = true;
      }
    }
    if (!keys_remain) {
      _valid_combos = _remove_val_from_array(_valid_combos, matched_combo);
    }
  };

  _receive_input = function(e, is_keydown) {
    var key;
    if (_prevent_capture) {
      if (_keys_down.length) {
        _keys_down = [];
      }
      return;
    }
    if (!is_keydown && !_keys_down.length) {
      return;
    }
    key = _convert_key_to_readable(e.keyCode);
    if (!key) {
      return;
    }
    if (is_keydown) {
      return _key_down(key, e);
    } else {
      return _key_up(key);
    }
  };

  _validate_combo = function(combo) {
    var i, key, _i, _ref;
    for (i = _i = 0, _ref = combo.keys.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      key = combo.keys[i];
      if (key === "meta") {
        combo.keys.splice(i, 1, _metakey);
      }
    }
    return true;
  };

  _decide_meta_key = function() {
    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
      _metakey = "cmd";
    }
  };

  _bug_catcher = function(e) {
    var _ref;
    if (__indexOf.call(_keys_down, "cmd") >= 0 && ((_ref = _convert_key_to_readable(e.keyCode)) !== "cmd" && _ref !== "shift" && _ref !== "alt")) {
      return _receive_input(e, false);
    }
  };

  window.keypress = {};

  keypress.wire = function() {
    _decide_meta_key();
    $('body').bind("keydown." + _event_classname, function(e) {
      _receive_input(e, true);
      return _bug_catcher(e);
    }).bind("keyup." + _event_classname, function(e) {
      return _receive_input(e, false);
    });
    return $(window).bind("blur." + _event_classname, function() {
      _keys_down = [];
      return _valid_combos = [];
    });
  };

  keypress.combo = function(keys_array, on_fire) {
    return keypress.register_combo({
      keys: keys_array,
      on_fire: on_fire
    });
  };

  keypress.register_many_combos = function(combo_array) {
    var combo, _i, _len;
    for (_i = 0, _len = combo_array.length; _i < _len; _i++) {
      combo = combo_array[_i];
      keypress.register_combo(combo);
    }
    return true;
  };

  keypress.register_combo = function(combo) {
    $.extend(true, {}, _combo_defaults, combo);
    if (_validate_combo(combo)) {
      _registered_combos.push(combo);
      return true;
    }
  };

  keypress.listen = function() {
    return _prevent_capture = false;
  };

  keypress.stop_listening = function() {
    return _prevent_capture = true;
  };

  _convert_key_to_readable = function(k) {
    switch (k) {
      case 9:
        return "tab";
        break;
      case 13:
        return "enter";
        break;
      case 16:
        return "shift";
        break;
      case 17:
        return "ctrl";
        break;
      case 18:
        return "alt";
        break;
      case 27:
        return "escape";
        break;
      case 32:
        return "space";
        break;
      case 37:
        return "left";
        break;
      case 38:
        return "up";
        break;
      case 39:
        return "right";
        break;
      case 40:
        return "down";
        break;
      case 49:
        return "1";
        break;
      case 50:
        return "2";
        break;
      case 51:
        return "3";
        break;
      case 52:
        return "4";
        break;
      case 53:
        return "5";
        break;
      case 65:
        return "a";
        break;
      case 67:
        return "c";
        break;
      case 68:
        return "d";
        break;
      case 69:
        return "e";
        break;
      case 70:
        return "f";
        break;
      case 81:
        return "q";
        break;
      case 82:
        return "r";
        break;
      case 83:
        return "s";
        break;
      case 84:
        return "t";
        break;
      case 87:
        return "w";
        break;
      case 88:
        return "x";
        break;
      case 90:
        return "z";
        break;
      case 91:
        return "cmd";
        break;
      case 224:
        return "cmd";
        break;
    }
    return false;
  };

}).call(this);
'use strict';

auth = require("../../configs/auth")();

module.exports = function(app) {
    var notes = require('../controllers/note');

    app.route('/note')
        .get(auth.authenticate(), notes.list_all_notes_by_user)
        .post(auth.authenticate(), notes.create_notes);
    
    app.route('/note/:noteId')
        .get(auth.authenticate(), notes.read_a_note)
        .put(auth.authenticate(), notes.update_a_note)
        .delete(auth.authenticate(), notes.delete_a_note);

    app.route('/notes')
        .post(auth.authenticate(), notes.get_notes)
        .put(auth.authenticate(), notes.update_notes)
        .delete(auth.authenticate(), notes.delete_notes);
};
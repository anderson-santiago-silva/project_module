const { model, Schema, Types } = require('mongoose');

const petSchema = new Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    image: { type: String, default: 'https://pics.freeicons.io/uploads/icons/png/9866538401579606325-512.png' },
    species: { type: String, required: true, enum: ['dog', 'cat', 'parrot'] },
    birthDate: { type: Date },
    owner: { type: Types.ObjectId, ref: 'User' },
},
{
    timestamps: true,
});

const Pet = model('Pet', petSchema);
module.exports = Pet;
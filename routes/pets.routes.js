const express = require('express');
const { format } = require('date-format-parse');

const Pet = require('../models/Pet');
const User = require('../models/User');

const fileUploader = require('../config/cloudinary.config');

const router = express();


router.get('/', (req, res) => {
    const { petName } = req.query;

    Pet.find({ owner: req.session.currentUser._id, name: { $regex: new RegExp(petName, 'i') } })
        .then((petsFromDatabase) => {
            console.log(petsFromDatabase);
            res.render('pets', { pets: petsFromDatabase, currentUser: req.session.currentUser });
        });
});

router.get('/new', (req, res) => {
    res.render('newPet', {currentUser: req.session.currentUser});
});

router.get('/:petId', (req, res) => {
    const { petId } = req.params;

    Pet.findById(petId).populate('owner')
    .then(petFromDatabase => {
        const birthDateParsed = format(petFromDatabase.birthDate, 'YYYY-MM-DD');
        
        const mongoDbobject = petFromDatabase.toJSON();

        const newObject = { ...mongoDbobject, birthDate: birthDateParsed };

        const sepeciesValues = [
            { value: 'cat', text: 'Cat' },
            { value: 'dog', text: 'Dog' },
            { value: 'parrot', text: 'Parrot' },
        ];

         const petIndex = sepeciesValues.findIndex((specieOption) => {
            return specieOption.value === petFromDatabase.species;
        });

        const foundSpeciesValue = sepeciesValues[petIndex];
        sepeciesValues.splice(petIndex, 1);
        sepeciesValues.unshift(foundSpeciesValue);

        
        res.render('petDetail', { pet: newObject, sepeciesValues, petSpeciesText: foundSpeciesValue.text, currentUser: req.session.currentUser });
    });
});

router.post('/new', fileUploader.single('petImage'), (req, res) => {
    const { petName, petImage, petSpecies, petBirthDate } = req.body;

    const newPet = {
        name: petName,
        image: req.file.path,
        species: petSpecies,
        birthDate: petBirthDate,
        owner: req.session.currentUser._id, 
    };

    Pet.create(newPet)
        .then(() => {
            res.redirect('/pets');
        })
        .catch(error => console.log(error));
});

router.post('/edit/:petId', (req, res ) => {
    const { petName, petImage, petSpecies, petBirthDate } = req.body
    const { petId } = req.params; 

   Pet.findByIdAndUpdate(petId, { name: petName, image: petImage, species: petSpecies, birthDate: petBirthDate })
    .then(() => {
        res.redirect(`/pets/${petId}`);
    })
    .catch(error => console.log(error));
});

module.exports = router;
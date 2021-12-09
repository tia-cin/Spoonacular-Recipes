const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// requerimos controllers
const { getAllInfo } = require('./getInfos')
// requirimos los models
const { Recipe, Diet } = require('../db')
// requerimos axios
const axios = require('axios')
// requerimos la apiKey
const { API_KEY } = process.env

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// ruta para obtener todas las recetas
router.get('/recipes', async (req, res) => {
    let { name } = req.query;
    let allRecipes = await getAllInfo();
    // console.log('apicall', allRecipes)
    try {
        // get recipe by name
        if (name) {
            let search = await allRecipes.filter(r => r.title.toLowerCase().includes(name))
            if (search.length) return res.status(200).send(search)
            else return res.status(404).send('No se encontró la receta')
        }
        return res.status(200).send(allRecipes)
    }
    catch(error) {
        console.log(error)
    }
} );


// ruta para obtener una receta por id de la misma
router.get('/recipes/:id', async (req, res) => {
    let { id } = req.params
    try {
        if (id.length < 10) {
        let recipe = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
        return res.json({
                id: recipe.data.id,
                name: recipe.data.title,
                img: recipe.data.image,
                diets: recipe.data.diets,
                score: recipe.data.spoonacularScore,
                health_score: recipe.data.healthScore,
                summary: recipe.data.summary,
                instructions: recipe.data.instructions
        })
        }
        else {
            let recipe = await Recipe.findByPk(id, { include: Diet })
            return res.json(recipe)
        }
    } catch(error) {
        console.log(error)
    }
})


// ruta para obtener los tipos de dietas
router.get('/types', async (req, res) => {
    try {
         let infoApi = await getAllInfo()
        let diets = infoApi.map(d => d.diets)
        let eachDiet = diets.map(d => {for (let i = 0; i < d.length; i++) return d[i]})
        eachDiet.push('ketogenic', 'vegetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'pescetarian', 'paleo', 'primal', 'low fodmap', 'whole30')
        eachDiet.forEach(d => {
            Diet.findOrCreate({ where: { name: d } })
        });
        
        let allDiets = await Diet.findAll()
        res.send(allDiets)
    } catch(error) {
        console.log(error)
    }
})


// ruta para puclicar receta personalizada por el usuario
router.post('/recipe', async (req, res) => {
    let { name, summary, score, health_score, instructions, diets } = req.body;
    try {
         let newRecipe = await Recipe.findOrCreate({
            name, 
            summary,
            score,
            health_score,
            instructions
        }) 
        let recipeDiet = await Diet.findAll({ where: { name: diets } })
        newRecipe.addDiet(recipeDiet)
        res.send('Nueva Receta creada con éxito!')
    } catch(error) {
        console.log(error)
    }
})

module.exports = router;

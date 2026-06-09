const { Router } = require('express');
const { getTodos, createTodo, toggleTodo, deleteTodo } = require('../controllers/todoController');

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

module.exports = router;

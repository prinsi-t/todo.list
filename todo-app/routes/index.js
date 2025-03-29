import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
};

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/dashboard', ensureAuth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.render('dashboard', { todos, title: 'Dashboard' });
  console.log('Authenticated user:', req.user);

});

router.get('/todos', ensureAuth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.render('todos', { todos, title: 'Todos' });
});

router.post('/todos', ensureAuth, async (req, res) => {
  await Todo.create({ user: req.user.id, text: req.body.text });
  res.redirect('/todos');
});

router.post('/todos/:id/complete', ensureAuth, async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect('/todos');
});

router.delete('/todos/:id', ensureAuth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/todos');
});

export default router;
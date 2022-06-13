const router = require('express').Router();
const { User, Store, GiftCard, Items, newStore } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('../views/homepage');
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: GiftCard }],
    });

    const newstores = await newStore.findAll({
       where: {
        user_id: req.session.user_id,
      },
       raw: true,
       nest: true,
   });

    //const newstores = newstoresdata.get({ plain: true });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user, newstores: newstores,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

module.exports = router;

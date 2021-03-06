const router = require('express').Router();

const { User, Store, GiftCard, Items, newStore } = require('../../models');
const withAuth = require('../../utils/auth');

// store routes
//create
router.post('/', withAuth, async (req, res) => {
  try {
    const Store = await newStore.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(Store);
    console.log('data posted');
  } catch (err) {
    res.status(400).json(err);
  }
});
//get store data
router.get('/:id', withAuth, async (req, res) => {
  try {
    const storeData = await newStore.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    if (!storeData || storeData.user_id != req.session.user_id) {
      res.render('newstore_error', {
        logged_in: true,
      });
      return;
    }
    const data = storeData.get({ plain: true });
    res.render('newstore', {
      ...data,
      logged_in: true,
    });
    // res.status(200).json(storeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const storeData = await newStore.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!storeData) {
      res.status(404).json({ message: 'No store found with this id!' });
      return;
    }
    res.status(200).json(storeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

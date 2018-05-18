export default (req, res, next) => {
  if (!req.user.canEdit) {
    res.status(403).send({
      success: false,
      message: 'You don\'t have enough permissions',
    })
  } else {
    next()
  }
}
